const MAX_SPEED = 20;
const MAX_ACC = 10;
const ACC_SEC = 2;
const STOP_THRESHOLD = 1.5;
const ACC_VECTOR = VECTOR_ZERO;
// class Character2 {
//     logic(delta: number): void {
//         let deltaSeconds = delta / 1000;

//         // TODO: Manage keyUps,  how?
//         // TODO: Too much inertia?
//         // TODO: Stop accelerating and stop velocity on wall hit

//         let acc = VECTOR_ZERO;
//         if (kb.isPressed(KeyboardKey.W)) {
//             acc = acc.add(VECTOR_UP);
//         }
//         if (kb.isPressed(KeyboardKey.D)) {
//             acc = acc.add(VECTOR_RIGHT);
//         }
//         if (kb.isPressed(KeyboardKey.S)) {
//             acc = acc.add(VECTOR_DOWN);
//         }
//         if (kb.isPressed(KeyboardKey.A)) {
//             acc = acc.add(VECTOR_LEFT);
//         }
//         // New acceleration direction + extra acceleration CAPPED
//         this.acceleration = acc.unit().scale(Math.min(this.acceleration.magnitude + ACC_SEC / deltaSeconds, MAX_ACC));

//         // TODO: If we suddenly change the direction, it should be more smooth
//         // TODO: Stop movement in one direction when we let go of those keys

//         if (this.acceleration.magnitude === 0) {
//             // If we are not accelerating (we let go of the keyboard)
//             // then we apply a powerful force in the opposite direction of the velocity
//             let appliedAcc = this.speed.scale(-0.5).clamp(MAX_ACC, null);

//             this.speed = this.speed.add(appliedAcc.scale(deltaSeconds)).clamp(MAX_SPEED);
//             // If the total speed is less than some threshold we just stop it.
//             if (this.speed.magnitude < STOP_THRESHOLD) {
//                 this.speed = VECTOR_ZERO;
//                 this.acceleration = VECTOR_ZERO;
//             }
//         } else {
//             // speed is currentSpeed + acc
//             this.speed = this.speed.add(this.acceleration.scale(deltaSeconds)).clamp(MAX_SPEED);
//         }

//         this.position = this.position
//                             .translate(this.speed)
//                             .clamp(
//                                 CHAR_SIZE_OFFSET,
//                                 CANVAS_WIDTH - CHAR_SIZE_OFFSET,
//                                 CHAR_SIZE_OFFSET,
//                                 CANVAS_HEIGHT - CHAR_SIZE_OFFSET
//                             );
//     }    
// }