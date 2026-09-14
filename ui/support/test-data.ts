
export type Creds = {
  username: string;
  password: string;
};

export const users = {
  standard: { username: "standard_user", password: "secret_sauce" },
  lockedOut: { username: "locked_out_user", password: "secret_sauce" },
  invalid: { username: "invalid_user", password: "wrong_password" },
};

export const backpack = {
  name: "Sauce Labs Backpack",
  price: "$29.99",
};

export const buyer = {
  firstName: "Raja",
  lastName: "Sekhar",
  zip: "NW4 3PW",
};

export const errors = {
  badLogin: "Epic sadface: Username and password do not match any user in this service",
  lockedOut: "Epic sadface: Sorry, this user has been locked out.",
  needFirstName: "Error: First Name is required",
  thanks: "Thank you for your order!",
};
