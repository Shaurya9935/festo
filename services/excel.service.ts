import * as XLSX from "xlsx";
import { db } from '@/db';


type ColumnMapping = {
    nameCol: string;
    emailCol: string;
    phoneCol?: string;
    idCol?: string;
}

export async function processAndSaveParticipants(
    eventId: string,
    rawData: any[],
    mapping: ColumnMapping
){

}