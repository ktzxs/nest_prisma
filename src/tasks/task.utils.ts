import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskUtils {
    splitString(str: string): string[] {
        return str.split('')
    }
}
