import { Byte } from "@angular/compiler/src/util";
import { Coordinates } from "./Coordinates";

export class ApiEvent{
    public id: number;
    public name: string;
    public description: string;
    public photos: Byte[];
    public price: number;
    public numbers: string[];
    public coordinates: Coordinates;
    public eventDate: Date;
    public isApproved: boolean;
    public owner: string;
}