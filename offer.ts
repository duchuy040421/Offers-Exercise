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

    private inputData(fileName: string) {
        const rawData = this.file.input(fileName);
        this.data = JSON.parse(rawData);
    }

    private outputData(fileName: string, data: OfferItem[]) {
        const outputData = { offers: data };
        this.file.output(fileName, outputData);
        console.log(`Filtered offers have been saved to ${fileName}`);
    }

    private getClosestMerchantDistance(offer: OfferItem): number {
        return Math.min(
            ...offer.merchants.map((merchant) => merchant.distance)
        );
    }

    private filterOffers(checkinDate: string, offers: OfferItem[]): void {
        const filteredOffers: OfferItem[] = [];

        const checkinDateObj = new Date(checkinDate);

        // Filter offers based on category and validity period
        const validOffers = offers.filter(
            (offer) =>
                offer.category in Category &&
                new Date(offer.valid_to) >=
                    new Date(checkinDateObj.getTime() + 5 * DAY_MILISECONDS)
        );

        // Sort offers by merchant distance
        validOffers.sort(
            (a, b) =>
                this.getClosestMerchantDistance(a) -
                this.getClosestMerchantDistance(b)
        );

        // Select the top offers with different categories
        const selectedCategories = new Set<number>();
        for (const offer of validOffers) {
            offer.merchants.sort((a, b) => a.distance - b.distance);

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

        if (filteredOffers.length !== TOP_OFFERS) {
            if (validOffers.length >= TOP_OFFERS) {
                filteredOffers.push(...validOffers.slice(1, TOP_OFFERS));
            }
        }

        this.dataFilter = filteredOffers;
    }

    run(checkinDate: string, fileNameInput: string, fileNameOutput: string) {
        this.inputData(fileNameInput);
        this.filterOffers(checkinDate, this.data.offers);
        this.outputData(fileNameOutput, this.dataFilter);
    }
}

export default Offer;
