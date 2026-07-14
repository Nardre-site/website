## What is it?

This project is a neural network that recognizes handwritten digits (0 to 9), trained on the MNIST dataset, a standard benchmark in machine learning containing 70,000 labeled handwritten digit images.

The entire network is implemented from scratch in Python, without any machine learning library. No PyTorch, no TensorFlow, just numpy and math.

[GitHub repo](https://github.com/Nardre/chiffre)

## The Dataset

MNIST contains:
- 60,000 training images
- 10,000 test images

Each image is 28×28 pixels in grayscale, flattened into a vector of 784 values between 0 and 255. The pixel values are normalized to [0, 1] before being fed to the network.

## The Neural Network

The architecture is a simple fully connected feedforward network:

```
784 inputs  →  100 hidden neurons  →  10 outputs
```

- 784 inputs: one per pixel
- 100 hidden neurons: with sigmoid activation
- 10 outputs: one per digit, the predicted class is the neuron with the highest activation

The cost function is the mean squared error between the output and the one-hot encoded label.

## Training Backpropagation

The network is trained using stochastic gradient descent with backpropagation.

For each mini-batch of images:

1. Forward pass: compute activations layer by layer
2. Output error: compute the gradient of the cost with respect to the output
3. Backpropagate: propagate the error backwards through the layers using the chain rule
4. Update: adjust weights and biases in the direction that reduces the cost

![[Project/Handwritten Digit Recognition images/image1.png]]

The weights are updated after each mini-batch, scaled by the learning rate divided by the batch size.

## Visualization

A pygame interface lets you browse through test images and see the network's prediction in real time. It also displays the weights of each layer as a color map, blue for positive weights, red for negative. Giving a visual intuition of what each neuron has learned to detect.

## Results

After training on the full 60,000 image dataset, the network reaches around 95% accuracy on the test set, a solid result for a network this simple, trained entirely from scratch.
![[Project/Handwritten Digit Recognition images/image2.png]]

## Technical Stack

- Python with `numpy` for matrix operations
- pygame for the visualization interface
- No machine learning library, backpropagation implemented from scratch

# Source
[neural networks and deep learning](http://neuralnetworksanddeeplearning.com/chap2.html)