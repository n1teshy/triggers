export function makeResponse(data, status = 200, headers = null) {
  const response = {
    statusCode: status,
    body: JSON.stringify(data),
  };
  if(headers !== null) {
    response.headers = headers;
  }
  return response;
}

export const statuses = {
  OK: 200,
  BAD_REQUEST: 400,
  UNPROCESSABLE: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};
