import Globals from "./Globals";
import Vec2 from "./interfaces/Vec2";

module Utils{
    export function adjustedToAbsPos(relPosition: Vec2): Vec2 {
        const x: number= Globals.tileWidth*1.5 + (Globals.tileWidth* 2* relPosition.x);
        const y: number= Globals.tileHeight*1.5 + (Globals.tileHeight* relPosition.y);
        return {x:x, y:y};
    }
}

export default Utils;