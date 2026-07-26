# Context
I made this project during my prepa for my TIPE. I'll show how I tried to find a successor of Conway Game of life in third dimension.

![[img15.jpg|150]]
# Origins
In 1949, John von Neumann studied cellular automata and their ability to self-replicate. A cellular automaton is a mathematical model consisting of a grid of cells, where each cell has a state. This state evolves according to a local rule based on the cell itself and its neighborhood (a finite set of cells). He created an automaton that reads a program as input and constructs the associated machine. Thus, cellular automata are indeed capable of self-replication.

![[img23.jpg|167]]![[img24.jpg|300]]

In 1970, Conway sought an automaton capable of self-replication but with much simpler and more realistic rules than Von Neumann’s, which was essentially a mini-computer. He created the Game of Life on a 2D grid where cells have only two states: alive or dead. In this model, a cell's neighborhood consists of the 8 surrounding cells.
![[img33.jpg|300]]![[img32.jpg|294]]

# Local Rules
The local rule is based on three conditions: survival, death, and birth. A cell survives if it is alive and has 2 or 3 neighbors; it dies of overpopulation if it has 4 or more, or of isolation if it has fewer than 2. A new cell is born if it has exactly 3 neighbors. We can encode these rules using a quadruplet (EL, EU, FL, FU), representing the intervals for survival and fertility. For example, on the left diagram, the 4 cells have 3 neighbors, so they survive... (Blinker example).

![[rules.png|600]]

Thanks to these rules, Conway identified three main families of structures: stable structures (like the block), oscillators (like the blinker, which returns to its initial state), and gliders (which return to a stable state but shifted in space).
![[cgol_3.png]]

As part of this TIPE, I studied Conway’s Game of Life within a 3D grid, using a different local rule. Rule (5, 7, 6, 6), Moore
![[img63.jpg]]

Why did I change the local rule? If I kept the 2-3-3-3 rule in 3D, I would face unbounded growth, making the emergence of stable structures, oscillators, or gliders impossible.
![[primordial_soup.png]]

I chose the 5-7-6-6 rule, based on the cube and blinker structures presented earlier. I later discovered that the 5-7-6-6 rule is one of the rare rules where gliders emerge naturally from a 'primordial soup'.
![[img86.jpg|343]]![[img85.jpg|345]]

With these rules, I achieve limited growth and the emergence of gliders, oscillators, and stable structures.
![[img96.jpg|300]]![[img97.jpg|300]]

Once the rules were established, I searched for specific structures using three different techniques.
![[glider.png|300]]

Once the rules were established, I searched for specific structures using three different techniques.

# Search of structure

## Genetic Algorithm
My first technique involves a genetic algorithm. I start with 10 random individuals, observe their generations, and assign a score. I then mutate the best ones to eventually obtain optimized structures. The score is based on the number of cells and births. This allowed me, for example, to obtain this 'totem'.
![[img123.jpg|300]]![[img124.jpg|300]]

By prioritizing the number of cells, I obtained many large, stable structures, such as this square.
![[img132.jpg|316]]

By maximizing the number of births, I discovered several oscillators.

![[img139.jpg|300]]![[img140.jpg|335]]

## Brute Force
The second technique used is brute force. When Conway designed his game, he tested initial structures and observed their evolution. We notice that several initial structures can lead to the same result, while others can be totally different, unpredictable, and complex.
![[img148.jpg]]

I tested all possibilities within a 5×5×2 volume, similar to Conway's approach. To filter out known structures, I used linearization. Since structures were sometimes disconnected, I used a Breadth-First Search (BFS) to separate connected components.
![[img156.jpg]]

This led to the discovery of a horizontal glider and other unique structures.
![[structure.png]]

## Sat Solver
The third method used is an SMT solver, specifically Z3, released by Microsoft in 2012. Researchers who previously worked on 3D Game of Life did not have access to such technology. Z3 is an SMT solver, a tool that finds variable assignments to make a logical formula satisfiable. Unlike a SAT solver, Z3 can handle mathematical formulas. It uses the CDCL algorithm (an evolution of DPLL), which assigns values and uses backtracking. With this, I found stable structures by inputting a boolean formula: either a cell is alive and stays alive, or it is dead and does not come to life. I found a huge number of stable figures, even though the number of possibilities is staggering.
![[z3.png]]

Here is an example of stable figures in 10×10 and 8×8, as well as a special structure we will study later.
![[img217.jpg|256]]![[img218.jpg|419]]

Once we have our structures, the goal is self-replication.
# Turing complete ?

## Gun Glider
To achieve this, we must make the game Turing-complete, meaning it can theoretically run any program—including itself. In 2D, we have 'glider guns', simple structures that produce infinite gliders. This is analogous to electricity, allowing us to build AND and NOT gates. This is how the 2D Game of Life was proven Turing-complete. In 2012, someone even built the Game of Life inside the Game of Life. For our 3D rules, the probability of finding such a structure by chance is nearly zero; its existence in 2D is due to the ease with which gliders appear."
![[img233.jpg]]

## Space Barrier
The alternative found by researchers is to build a 'space barrier' that prevents cell generation on one of the three axes. It’s as if we were running the 2D Game of Life between the walls of the space barrier.
![[barier.png]]

There was no explanation of how researchers found this space barrier, but using Z3, I managed to find a structure with the exact same properties.
![[barroer_2.png]]

By placing a glider gun in the generator, a problem arises: finding a gate. Using Z3, I demonstrated that a stable gate does not exist. We would therefore need to find an oscillator capable of handling the transition between two gliders.

![[img262.jpg|300]]![[img263.jpg|300]]
![[img271.jpg|300]]


## Space barrier AND
By assembling 3 space barriers we can simulate an And door.
![[and.png]]

## Space barrier Not
By assembling 2 space barriers we can simulate a Not door.
![[not.png]]

# Implementation
(Now guess because I didn't wrote this part, it is just algorithm)
![[Screenshot_20260501_005927.png]]
![[classique.png]]
![[inverse.png]]
![[hashlife.png]]
![[complexity.png]]

# Conclusion
I got 14 with this but it was a lot of fun.
The code was written in c and python in an era where AI wasn't so powerful.
I'll share source code rewritten in c++ on on github later.

# Credits
by Nardre

based on Carte Bays works:
Complex Systems 1 (1987) 373-400
Candidates for the Game of Life in Three Dimensions
Carter Bays
Department of Computer Sc ienc e, University of South Carolina,
Columbia, SC 29208, USA 