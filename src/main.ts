import { invoke } from "@tauri-apps/api/tauri";

function moveMouse(x: number, y: number) {
  if( x !== 0 || y !== 0){
    if(x > 0){
      x = Math.ceil(x)
    }
    else{
      x = Math.floor(x)
    }
    if(y > 0){
      y = Math.ceil(y)
    }
    else{
      y = Math.floor(y)
    }

    invoke("move_mouse", { x, y })
  }
}

let keys = {
  a: false,
  b: false,
  r: false,
  zr: false,
  x: false,
}

let sensitivity = 3
let lastScrolled = 0
const runGamepad = () => {
  const pads = navigator.getGamepads()
  pads.forEach((gamepad) => {
    if(!gamepad){
      return
    }
    if(gamepad.buttons[0].pressed !== keys.a){
      keys.a = gamepad.buttons[0].pressed
      invoke(keys.a ? 'press_mouse' : 'release_mouse', {
        button: 'left'
      })
    }
    if(gamepad.buttons[2].pressed !== keys.b){
      keys.b = gamepad.buttons[2].pressed
      invoke(keys.b ? 'press_mouse' : 'release_mouse', {
        button: 'right'
      })
    }
    if(gamepad.buttons[8].pressed !== keys.r){
      keys.r = gamepad.buttons[8].pressed
      if(keys.r && keys.x){
        sensitivity += 1
      }
    }
    if(gamepad.buttons[7].pressed !== keys.zr){
      keys.zr = gamepad.buttons[7].pressed
      if(keys.zr && keys.x){
        sensitivity -= 1
      }
    }
    if(gamepad.buttons[1].pressed !== keys.x){
      keys.x = gamepad.buttons[1].pressed
    }
    if(!keys.r){
      moveMouse(gamepad.axes[1] * sensitivity, 0 - gamepad.axes[0] * sensitivity)
    }
    else if(gamepad.axes[1] !== 0){
      if(Date.now() - lastScrolled > 100){
        invoke('scroll_mouse', {
          delta: Math.ceil(gamepad.axes[0] > 0 ? 1 : -1)
        })
        lastScrolled = Date.now()
      }
    }
  })
  requestAnimationFrame(runGamepad)
}

requestAnimationFrame(runGamepad)