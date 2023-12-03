import { validateInput } from "./validateInput";
import Offer from "./offer";
import { INPUT_FILE_NAME, OUTPUT_FILE_NAME } from "./constants";

(function (): void {
    const checkinDate: string = validateInput();
    const offer = new Offer();
    offer.run(checkinDate, INPUT_FILE_NAME, OUTPUT_FILE_NAME);
})();
