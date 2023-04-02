import { createChart, updateChart } from "./scatterplot.js"
document.getElementById("btn").addEventListener("click", makePrediction)
let field = document.querySelector("#field")
//
// demo data
//
function loadData() {
    Papa.parse("./cars.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => checkData(results.data)
    })
}

function checkData(data) {
    console.table(data)
    const chartdata = data.map(car => ({
        x: car.horsepower,
        y: car.mpg,
    }))
    const chart = createChart(chartdata)
    
    // shuffle
    data.sort(() => (Math.random() - 0.5))

    // een voor een de data toevoegen aan het neural network
    for (let car of data) {
        nn.addData({ horsepower: car.horsepower }, { mpg: car.mpg })
    }

    // normalize
    nn.normalizeData()
    startTraining()
}

function startTraining() {
    nn.train({ epochs: 10 }, () => finishedTraining())
}

async function finishedTraining() {
    console.log("Finished training!")  
        let predictions = []
        for (let hp = 40; hp < 250; hp += 2) {
            const pred = await nn.predict({horsepower: hp})
            predictions.push({x: hp, y: pred[0].mpg})
        }
        updateChart("Predictions", predictions)
    }

async function makePrediction() {
    let input = field.value
    console.log(input)
    const results = await nn.predict({horsepower: parseFloat(input)})
    console.log(`Geschat verbruik: ${results[0].mpg}`)
}


loadData()
const nn = ml5.neuralNetwork({ task: 'regression', debug: true })






