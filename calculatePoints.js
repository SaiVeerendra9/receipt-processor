const { parseISO, getDate } = require('date-fns');

const calculatePoints = (receipt) => {
    let points = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name.
    points += (receipt.retailer.match(/[a-z0-9]/gi) || []).length;

    // Rule 2: 50 points if the total is a round dollar amount with no cents.
    if (Number(receipt.total) % 1 === 0) {
        points += 50;
    }

    // Rule 3: 25 points if the total is a multiple of 0.25.
    if (Number(receipt.total) % 0.25 === 0) {
        points += 25;
    }

    // Rule 4: 5 points for every two items on the receipt.
    points += Math.floor(receipt.items.length / 2) * 5;

    /* Rule 5: If the trimmed length of the item description is a multiple of 3, 
       multiply the price by 0.2 and round up to the nearest integer. 
       The result is the number of points earned. */
       
    receipt.items.forEach(item => {
        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength % 3 === 0) {
            points += Math.ceil(Number(item.price) * 0.2);
        }
    });

    // Rule 6: 6 points if the day in the purchase date is odd.
    const purchaseDate = parseISO(receipt.purchaseDate);
    const dayOfMonth = getDate(purchaseDate);
    if (dayOfMonth % 2 !== 0) {
        points += 6;
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    const hours = parseInt(receipt.purchaseTime.split(':')[0]);
    if (hours === 14 || hours === 15) {
        points += 10;
    }

    return points;
};

module.exports = calculatePoints;