import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

// @ts-ignore
import terminal00Script from "./scripts/terminal00.inline"

const Terminal00: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    if (fileData.slug !== "Project/Terminal00")
        return null

    return (
        <div
          id="graph"
          style={{ width: "100%", height: "800px"}}
        />
    )
}

Terminal00.afterDOMLoaded = terminal00Script

export default (() => Terminal00) satisfies QuartzComponentConstructor
