export const auth = (req, res, next) => {
    try {
        if(!req.session.user) {
            return res.status(401).json({ message: "Authorization denied" });
        }
        next();
    }
    catch (e) {
        return res.status(500).json({ message: error.message });
    }
}
