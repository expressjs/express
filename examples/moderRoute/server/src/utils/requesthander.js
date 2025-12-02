export const RequestHandler = async (fn) => {
    try {

        await fn(req, res, next);

    } catch (err) {
        throw new Error("Server Problem ", err);
    }
}