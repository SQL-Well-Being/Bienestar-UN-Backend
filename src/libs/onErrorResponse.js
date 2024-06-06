// Functio for return the appropriate HTTP status code on errors

const COMMAND_DENIED_SQL_ERRNO = 1370;
const NO_REFERENCED_ROW_SQL_ERRNO =  1452;
const USER_DEFINED_EXEPTION_SQL_ERRNO = 1644;

function onErrorResponse(res, error){
    if(error.errno === COMMAND_DENIED_SQL_ERRNO){
        res.status(403);
    } else if(error.errno === NO_REFERENCED_ROW_SQL_ERRNO || error.errno === USER_DEFINED_EXEPTION_SQL_ERRNO){
        res.status(400);
    } else{
        res.status(500);
    }

    res.json({message: error.message});

    return res;
}

export default onErrorResponse;