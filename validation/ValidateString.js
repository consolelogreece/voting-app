
// This is used to validate any strings. If converts url encoded characters to the relevent chars. i.e. in a url, a space becomes "%20", this function reverses converts it back.
// This is crude, more validation should be added for edge cases.
export const convertUrl = string => {
    let validatedString = string;
    validatedString = validatedString.replace(/%20/g , " ");
    validatedString = validatedString.replace(/%3f/g, "?")
    return validatedString
  }