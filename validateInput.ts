function isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

export function validateInput(): string {
    const checkinDate = process.argv[2];

    if (!isValidDateFormat(checkinDate)) {
        console.error(
            "Please provide a check-in date in the format YYYY-MM-DD"
        );
        process.exit(1);
    }

    return checkinDate;
}
