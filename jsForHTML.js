const opt_D = document.getElementById("opt")
const optt_D = document.getElementById("optt")
const RestAll_B = document.getElementById("ResetAll")
const UpDataAll_B = document.getElementById("UpDataAll")
const Count_I = document.getElementById("count")
const Count_B = document.getElementById("Rcount")
const UpDataAllB_B = document.getElementById("ResetAllB")
const UpDataAllAll_B = document.getElementById("ResetAllAll")


function init(data) {
    optt_D.childNodes.forEach((e) => {
        if (e.tagName != 'DIV') {
            return
        }
        let t = e.firstChild.nextSibling.nextSibling.nextSibling
        // console.log(t)
        t.value = data[t.id]
    })
}
init(initdata2)

UpDataAllAll_B.addEventListener("click", () => {
    init(initdata)
    UpData(initdata)
    BoidData = initdata
    location.reload();
})

UpDataAllB_B.addEventListener("click", () => {
    Rcount2()
})

Count_I.value = quantity
Count_I.addEventListener("input", () => {
    quantity = Count_I.value
    Rcount()
    F()
})

Count_B.addEventListener("click", () => {
    let Wh = document.body.clientWidth;
    let Ht = window.innerHeight;
    quantity = Wh * Ht / 1700
    quantity = Math.floor(quantity)
    Count_I.value = quantity
    Rcount()
    F()
})

RestAll_B.addEventListener("click", () => {
    init(initdata)
    UpData(initdata)
    BoidData = initdata
    initdata2 = BoidData
    // console.log(6645465)
    F()
})

UpDataAll_B.addEventListener("click", () => {
    UpData(BoidData)
    // console.log(664544465)
    initdata2 = BoidData
    F()
})

opt_D.addEventListener("click", () => {
    opt_D.classList.add("sting")
})

optt_D.addEventListener("input", (e) => {
    const target = e.target
    const id = target.id
    // console.log(id)
    BoidData[id] = parseFloat(target.value)
})

optt_D.addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("R")) {
        return
    }

    const target2 = target.previousElementSibling
    const id = target2.id
    // console.log(id, initdata2)
    BoidData[id] = initdata2[id]
    target2.value = initdata2[id]
    F()
})


window.onbeforeunload = () => {
    UpData(BoidData)
};

function F() {
    opt_D.classList.add("flashh")
    setTimeout(() => {
        opt_D.classList.remove("flashh")
    },
        400);
}