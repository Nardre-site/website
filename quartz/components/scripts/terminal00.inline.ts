import ForceGraph from "force-graph"
import { forceCollide, forceManyBody } from "d3-force"

const imageCache: Record<string, HTMLImageElement> = {};

function getImageForNode(nodeName: string): HTMLImageElement | null {
    if (imageCache[nodeName]) return imageCache[nodeName];
    const img = new Image();
    img.src = `/static/Terminal00/images/${nodeName}.webp`;
    imageCache[nodeName] = img;
    return img;
}

document.addEventListener("nav", async () => {
    const container = document.getElementById("graph");
    if (!container) return;

    const response = await fetch("/static/Terminal00/graph.json");
    const gData = await response.json();

    container.innerHTML = "";

    const unknownImg = new Image();
    unknownImg.src = "/static/Terminal00/images/Unknown.webp";
    const size = 50
    let focusedNode = null
    const neighborIds = new Set<any>()

    const Graph = ForceGraph()(container)
        .width(container.clientWidth)
        .height(800)
        .graphData(gData)
        .cooldownTicks(100)
        .d3VelocityDecay(0.7)
        .d3Force('collide', forceCollide(size / 2 + 10))
        .d3Force('charge', forceManyBody().strength(-300))
        .linkDirectionalParticles(2)
        .linkDirectionalParticleWidth(5)
        .linkDirectionalParticleSpeed(0.005)
        .nodeLabel('name')

        .linkColor((link: any) => {
            if (!focusedNode) return "rgba(150, 150, 150, 0.3)"
            if (link.source.id === focusedNode.id) return "rgba(248, 113, 113, 1)";
            if (link.target.id === focusedNode.id) return "rgba(96, 165, 250, 1)";
            return "rgba(150, 150, 150, 0.3)"
        })

        .onNodeClick((node: any) => {
            if (focusedNode === node) {
                window.open(`https://angusnicneven.com/${node.name}`, "_blank")
                return;
            }
            focusedNode = node
            neighborIds.clear()

            gData.links.forEach((link: any) => {
                if (link.target.id === node.id) neighborIds.add(link.source.id);
                if (link.source.id === node.id) neighborIds.add(link.target.id);
            })

            Graph.nodeColor(Graph.nodeColor())
        })

        .onNodeHover((node: any) => {
            container.style.cursor = node ? "pointer" : "default"
        })

        .onBackgroundClick(() => {
            focusedNode = null
            neighborIds.clear()
            Graph.nodeColor(Graph.nodeColor())
        })

        .nodeCanvasObject((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const img = getImageForNode(node.name)
            const imageToDraw = img && img.complete && img.naturalWidth !== 0 ? img : unknownImg
            ctx.globalAlpha = !focusedNode || node === focusedNode || neighborIds.has(node.id) ? 1.0 : 0.15
            ctx.drawImage(imageToDraw, node.x - size/2, node.y - size/2, size, size)
            ctx.globalAlpha = 1.0
        })
        .nodePointerAreaPaint((node: any, color: string, ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = color
            ctx.fillRect(node.x - size/2, node.y - size/2, size, size)
        });

    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            Graph.width(entry.contentRect.width)
        }
    })
    resizeObserver.observe(container)

    if (window.addCleanup) window.addCleanup(() => resizeObserver.disconnect());
})
