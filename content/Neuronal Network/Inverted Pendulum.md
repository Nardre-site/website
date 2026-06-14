## What is it?

The inverted pendulum is a classic control problem: a rigid rod is attached to a cart that can move horizontally, and the goal is to keep the rod balanced upright by moving the cart left or right. It is inherently unstable and without active control, the pendulum falls over immediately.

In this project, instead of writing a control algorithm by hand, I let a neural network learn to balance the pendulum on its own, using a genetic algorithm to evolve the network's weights over generations.

[GitHub repo](https://github.com/Nardre/pendulum)

## The Simulation

The pendulum follows standard rigid body physics. The angular acceleration is given by:

```
θ'' = -(g·sin(θ) + a_cart·cos(θ)) / L
```

where `θ` is the angle, `g` is gravity, `a_cart` is the horizontal acceleration of the cart, and `L` is the rod length. Viscous friction is applied to both the angular velocity and the cart velocity to keep the simulation stable.

## The Neural Network

Each pendulum is controlled by a small fully connected neural network:

```
4 inputs  →  3 hidden neurons  →  1 output
```

| Input                       | Description                    |
| --------------------------- | ------------------------------ |
| `(θ - π) / π`               | Normalized angle (0 = upright) |
| `angular velocity / 0.8`    | Normalized angular speed       |
| `(x - center) / half_width` | Normalized cart position       |
| `cart velocity / 12`        | Normalized cart speed          |

The output is a value between -1 and 1 (via `tanh`), which directly controls the force applied to the cart.

The weights evolve through the genetic algorithm.

## The Genetic Algorithm

100 pendulums run in parallel every generation. Each one has its own neural network with different weights.

At the end of each generation (300 simulation steps):

1. Scoring: each network is scored based on how well it kept the pendulum upright. The score increases the closer the pendulum is to vertical, and accumulates a bonus the longer it stays balanced.

2. Selection: the top 5 networks are kept.

3. Copy & Mutate: the remaining 95 networks are replaced by copies of the top 5, then slightly mutated.

Over generations, the population converges toward networks that can balance the pendulum indefinitely.

## Progression
1st generation:
![[Neuronal Network/pendulum_images/image1.png]]

5th generation:
![[Neuronal Network/pendulum_images/image2.png]]

20th generation:
![[Neuronal Network/pendulum_images/image3.png]]

100th generation:
![[imgae4.png]]

1000th generation:
![[Neuronal Network/pendulum_images/image5.png]]

## Results

After a few hundred generations, the best networks learn a surprisingly effective strategy: they anticipate the pendulum's fall and move the cart to correct it, while keeping the cart near the center of the track to avoid hitting the boundaries.

## Technical Stack

- Python with `pygame` for the simulation and visualization
- No machine learning library,  the neural network and genetic algorithm are implemented from scratch
