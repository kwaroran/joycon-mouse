// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use mouse_rs::{types::keys::*, Mouse};

#[tauri::command]
fn move_mouse(x: i32, y:i32){
    let mouse = Mouse::new();
    let pos = mouse.get_position().unwrap();
    let _ = mouse.move_to(pos.x + x, pos.y + y);
}

#[tauri::command]
fn press_mouse(button: &str){
    let mouse = Mouse::new();
    let _ = match button {
        "left" => mouse.press(&Keys::LEFT),
        "right" => mouse.press(&Keys::RIGHT),
        "middle" => mouse.press(&Keys::MIDDLE),
        _ => mouse.press(&Keys::LEFT),
    };
}

#[tauri::command]
fn release_mouse(button: &str){
    let mouse = Mouse::new();
    let _ = match button {
        "left" => mouse.release(&Keys::LEFT),
        "right" => mouse.release(&Keys::RIGHT),
        "middle" => mouse.release(&Keys::MIDDLE),
        _ => mouse.release(&Keys::LEFT),
    };
}

#[tauri::command]
fn scroll_mouse(delta: i32){
    let mouse = Mouse::new();
    let _ = mouse.wheel(delta);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![move_mouse, release_mouse, press_mouse, scroll_mouse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


