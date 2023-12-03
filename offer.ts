import { Data, OfferItem } from "./types";
import File from "./file";
import { DAY_MILISECONDS, TOP_OFFERS } from "./constants";
import Category from "./enum";

class Offer {
    data!: Data;
    dataFilter!: OfferItem[];
    file: File;

    constructor() {
        this.file = new File();
    }

    inputData(fileName: string){
        const rawData = this.file.input(fileName);
        this.data = JSON.parse(rawData);
    }

    outputData(fileName: string, data: OfferItem[]){
        const outputData = { offers: data };
        this.file.output(fileName, outputData);
        console.log(`Filtered offers have been saved to ${fileName}`);
    }

    filterOffers(checkinDate: string, offers: OfferItem[]): void {
        const filteredOffers: OfferItem[] = [];

        const checkinDateObj = new Date(checkinDate);

        // Filter offers based on category and validity period
        const validOffers = offers.filter(
            (offer) =>
                offer.category in Category &&
                new Date(offer.valid_to) >=
                    new Date(checkinDateObj.getTime() + 5 * DAY_MILISECONDS)
        );

        // Sort offers by category and merchant distance
        validOffers.sort(
            (a, b) =>
                a.category - b.category ||
                a.merchants[0].distance - b.merchants[0].distance
        );

        // Select the top offers with different categories
        const selectedCategories = new Set<number>();
        for (const offer of validOffers) {
            if (!selectedCategories.has(offer.category)) {
                // Remove additional merchants if there are multiple
                offer.merchants = [offer.merchants[0]];
                filteredOffers.push(offer);
                selectedCategories.add(offer.category);
            }

            if (filteredOffers.length === TOP_OFFERS) {
                break;
            }
        }

        this.dataFilter = filteredOffers;
    }

    run(checkinDate: string, fileNameInput: string, fileNameOutput: string){
        this.inputData(fileNameInput);
        this.filterOffers(checkinDate, this.data.offers);
        this.outputData(fileNameOutput, this.dataFilter);
    }
}

export default Offer;