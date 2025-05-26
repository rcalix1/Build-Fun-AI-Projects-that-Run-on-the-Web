 class Perceptron {
            constructor(n) {
                this.weights = Array(n).fill(0);
                this.bias = 0;
                this.learningRate = 0.1;
            }

            activationFunction(x) {
                return x >= 0 ? 1 : -1;
            }

            predict(inputs) {
                let weightedSum = inputs.reduce((sum, input, index) => sum + input * this.weights[index], this.bias);
                return this.activationFunction(weightedSum);
            }

            train(trainingData, epochs = 10) {
                for (let epoch = 0; epoch < epochs; epoch++) {
                    for (let { input, label } of trainingData) {
                        let prediction = this.predict(input);
                        let error = label - prediction;
                        for (let i = 0; i < this.weights.length; i++) {
                            this.weights[i] += this.learningRate * error * input[i];
                        }
                        this.bias += this.learningRate * error;
                    }
                }
            }
 }

async function loadTrainingData() {
            const response = await fetch("https://raw.githubusercontent.com/Rex5433/Machine-Learning-Perceptron/main/SimpleTData.csv");
            const data = await response.text();
            const rows = data.trim().split("\n").slice(1);
            return rows.map(row => {
                const values = row.split(",").map(Number);
                return { input: values.slice(0, 16), label: values[16] };
            });
}

async function initialize() {
            const trainingData = await loadTrainingData();
            const perceptron = new Perceptron(16);
            perceptron.train(trainingData);

            function createGrid() {
                const grid = document.getElementById("grid");
                for (let i = 0; i < 16; i++) {
                    const cell = document.createElement("div");
                    cell.classList.add("cell");
                    cell.onclick = () => cell.classList.toggle("selected");
                    grid.appendChild(cell);
                }
            }
            createGrid();

            function flattenGrid() {
                return Array.from(document.querySelectorAll(".cell")).map(cell =>
                    cell.classList.contains("selected") ? 1 : 0
                );
            }

            function predict() {
                const input = flattenGrid();
                const prediction = perceptron.predict(input);
                const result = prediction === 1 ? 'L' : 'T';
                document.getElementById("output").innerText = `Prediction: ${result}`;
                document.getElementById("linear-array").innerText = `Input Array: [${input.join(", ")}]`;
                document.getElementById("array-container").style.display = "block";
            }

            document.getElementById("predict").addEventListener("click", predict);
}


document.addEventListener("DOMContentLoaded", initialize);



