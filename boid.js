function UpData(data) {
    jsonData = JSON.stringify(data);
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
    document.cookie = `jxdata=${jsonData}; expires=${expires.toUTCString()}`;
}

const initdata = {
    Calm: 10,
    Vision: 75,
    Speed: 40,
    Toward: 25,
    Spacing: 50,
    Mouse: 20,
    ToUnite: 10,
    Size: 75,
};
const cookie = document.cookie;
const cookies = cookie.split(';');
let jxdata;
for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === 'jxdata') {
        jxdata = value;
        break;
    }
}
let jsonData
if (!jxdata) {
    UpData(initdata)
    jsonData = initdata
} else {
    jsonData = JSON.parse(jxdata);
    console.log(jsonData);
}
let BoidData = jsonData
let initdata2 = {...BoidData}

console.log(BoidData, initdata2)
let mouseX = 0
let mouseY = 0

const triangle = [{ "x": 25, "y": 0 }, { "x": -20, "y": -15 }, { "x": -20, "y": 15 }]
// Boid 類別
class Boid {
    // 建構函式
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.m = 0
        this.direction = 0

        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = 60;
        this.height = this.canvas.height = 60;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.translate(30, 30);
        this.ctx.scale(BoidData.Size * 0.01, BoidData.Size * 0.01)
        this.create(this.ctx);
    }
    create(ctx) {

        ctx.clearRect(-30, -30, 60, 60);
        // ctx.fillStyle = '#2f63cf'
        // ctx.fillRect(-30, -30, 60, 60)

        ctx.fillStyle = '#7f63cf'
        ctx.beginPath();
        ctx.moveTo(triangle[0]["x"], triangle[0]["y"])
        ctx.lineTo(triangle[1]["x"], triangle[1]["y"])
        ctx.lineTo(triangle[2]["x"], triangle[2]["y"])
        ctx.fill();

        // ctx.fillStyle = '#7f63cf'
        // ctx.fillRect(0, 0, 10, 10)
    }
    // 繪製 Boid 物件
    draw(ctxa) {
        this.direction = (this.vx > 0 ? Math.atan(this.vy / this.vx) : Math.PI + Math.atan(this.vy / this.vx))
        this.ctx.rotate((this.direction))

        this.create(this.ctx);
        ctxa.drawImage(this.canvas, this.x - 30, this.y - 30);
        this.ctx.rotate((-this.direction))
    }

    // 更新 Boid 物件
    judge(boids) {
        // 計算鄰近 Boid 的平均位置
        let avgX = 0;//x加總
        let avgY = 0;//y加總
        let avgVX = 0;//x速度加總
        let avgVY = 0;//y速度加總
        let count = 0; //規模
        // let distance = distance(this, boid) //距離
        let DX
        let DY
        let distance

        for (const boid of boids) {
            DX = boid.x - this.x
            DY = boid.y - this.y
            distance = Math.sqrt(DX * DX + DY * DY)
            if (boid !== this && distance < BoidData.Vision) {
                // console.log(distance(this, boid))
                avgX += DX
                avgY += DY
                avgVX += boid.vx - this.vx;
                avgVY += boid.vy - this.vy;
                count++;
                this.vx += -BoidData.Spacing * 0.01 * DX / distance
                this.vy += -BoidData.Spacing * 0.01 * DY / distance
            }
        }
        if (count > 0) {
            // 向平均位置移動
            this.vx += BoidData.ToUnite * 0.01 * avgX / count + BoidData.Toward * 0.01 * avgVX / count
            this.vy += BoidData.ToUnite * 0.01 * avgY / count + BoidData.Toward * 0.01 * avgVY / count
        }
        let MX = mouseX - this.x
        let MY = mouseY - this.y
        let MD = Math.sqrt(MX * MX + MY * MY)
        if (MD < (BoidData.Vision - 15)) {
            this.m = 1
        }
        if (this.m == 1) {
            DX = mouseX - this.x
            DY = mouseY - this.y
            this.vx += -BoidData.Mouse * 0.1 * DX / (MD * 2)
            this.vy += -BoidData.Mouse * 0.1 * DY / (MD * 2)

            if (MD > BoidData.Vision + 25) {
                this.m = 0
            }
        }
    }
    move() {
        let DX = this.vx
        let DY = this.vy
        let distance = Math.sqrt(DX * DX + DY * DY)
        this.vx += BoidData.Calm * 0.01 * ((DX / distance * BoidData.Speed * 0.1) - DX)
        this.vy += BoidData.Calm * 0.01 * ((DY / distance * BoidData.Speed * 0.1) - DY)
        this.x += this.vx
        this.y += this.vy
        if (this.x > Wh) {
            this.x -= Wh
            this.vx *= 2
        }
        if (this.x < 0) {
            this.x += Wh
            this.vx *= 2
        }
        if (this.y > Ht) {
            this.y -= Ht
            this.vy *= 2
        }
        if (this.y < 0) {
            this.y += Ht
            this.vy *= 2
        }
    }
}

// 初始化 canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let Wh = document.body.clientWidth;
let Ht = window.innerHeight;

canvas.width = Wh;
canvas.height = Ht;
let quantity = Wh * Ht / 1700
quantity = Math.floor(quantity)

// quantity = 500

const boids = [];
for (let i = 0; i < quantity; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const vx = Math.random() * 14 - 7;
    const vy = Math.random() * 14 - 7;
    boids.push(new Boid(x, y, vx, vy));

}
// 每秒執行 60 次的更新函式
function abc() {
    Wh = document.body.clientWidth;
    Ht = window.innerHeight;
    canvas.width = Wh;
    canvas.height = Ht;
    // 清除 canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新每個 Boid 物件
    for (const boid of boids) {
        boid.judge(boids);
        boid.move()
        boid.draw(ctx)
    }
    window.requestAnimationFrame(abc);
}

window.requestAnimationFrame(abc)

canvas.addEventListener('mousemove', (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
});

function Rcount() {
    let l = boids.length
    if (quantity > l) {
        for (let i = 0; i < quantity - l; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const vx = Math.random() * 14 - 7;
            const vy = Math.random() * 14 - 7;
            boids.push(new Boid(x, y, vx, vy));
        }
    } else {
        boids.splice(0, l - quantity);
    }
}


function Rcount2() {
    let l = boids.length
    boids.splice(0, l);
    for (let i = 0; i < quantity; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = Math.random() * 14 - 7;
        const vy = Math.random() * 14 - 7;
        boids.push(new Boid(x, y, vx, vy));
    }
}

canvas.addEventListener("click", () => {
    opt_D.classList.remove("sting")
})