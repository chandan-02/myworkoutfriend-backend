const createFilter = (elements) => {
    let filter = {};
    elements.map(itm => {
        if (itm?.value) {
            // console.log(`${itm?.name} value =>`, new Date(itm?.value?.dateFrom).getDate())
            if (itm?.type == 'date' && itm?.value) {
                // For dates
                filter[itm.name] = {
                    $gte: itm.value.dateFrom,
                    $lte: itm.value.dateTo
                }
            }
            else if (itm?.type == 'array' && itm?.value) {
                // Searcing in docs array
                filter[itm.name] = { '$in': String(itm.value).split(',') };
            }
            else if (itm?.type == 'text' && itm?.value) {
                // Searcing in docs array
                filter[itm.name] = { '$regex': itm.value, '$options': 'i' };
            }
            else {
                /* 
                 * Normal String search with or
                 * Usage scenario: lets say u want to search if jake or mark exists in a doc  : name=jake,mark
                 * example: Doc1={name:'jake'} Doc2 = {name:'mark} Doc3 = {name:'jane'} ; will return Doc1, Doc2
                */
                filter['$or'] = String(itm.value).split(',').map(t => {
                    return { [itm.name]: t }
                })
            }
        }
    })
    return filter;
}

module.exports = { createFilter };