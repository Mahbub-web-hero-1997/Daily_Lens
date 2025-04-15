import ApiError from "../utils/ApiError.js";

const authorizedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "Forbidden access, you don't have permission to access this resource"
      );
    }
    next();
  };
};

export default authorizedRoles;
