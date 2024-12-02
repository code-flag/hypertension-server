
/**
 * This method is use to format and structure response data
 * @author - Francis Olawumi Awe - <awefrancolaz@gmail.com>
 * @param {Object} data - data to return back to the consumer if any
 * @param {string} message - descriptive message for the consumer
 * @param {string} mtype - message type <success or failed>
 * @returns Object
 */
export const returnMsg = (res: any, retData: any, message: string, status: string = "success", status_code: number = 200) => {
    let msg;

    status = status == "success" ? "success": "failed";

    msg = {
        status: status,
        status_code: status_code,
        data: retData,
        message: message
    }

    return res.status(status_code).json(msg);
}
