use mime_guess::from_ext;
use std::collections::HashMap;

#[napi]
pub fn etag(body: String, encoding: Option<String>) -> String {
  return create_e_tag_generator(false)(body, encoding);
}

#[napi]
pub fn wetag(body: String, encoding: Option<String>) -> String {
  return create_e_tag_generator(true)(body, encoding);
}

// Check if `path` looks absolute.
#[napi]
pub fn is_absolute(path: String) -> bool {
  let path_bytes = path.as_bytes();

  if path_bytes[0] == b'/' {
    return true;
  }

  // Windows device path
  if path_bytes[1] == b':' && (path_bytes[2] == b'\\' || path_bytes[2] == b'/') {
    return true;
  }

  // Microsoft Azure absolute path
  if path_bytes[0..2] == *"\\\\".as_bytes() {
    return true;
  }

  return false;
}

#[napi]
#[derive(Debug)]
pub struct Params {
  pub value: String,
  pub quality: Option<i32>,
  pub params: HashMap<String, String>,
}

// Parse accept params `str` returning an
// object with `.value`, `.quality` and `.params`.
fn accept_params(str: String) -> Params {
  let parts = str.split("; ").collect::<Vec<_>>();
  let mut ret = Params {
    value: parts[0].to_string(),
    quality: Some(1),
    params: HashMap::new(),
  };

  for part in parts {
    let pms = part.split('=').collect::<Vec<_>>();

    if pms[0] == "q" {
      ret.quality = Some(pms[1].parse::<i32>().unwrap());
    } else {
      ret.params.insert(pms[0].to_string(), pms[1].to_string());
    }
  }

  return ret;
}

// Normalize the given `type`, for example "html" becomes "text/html".
#[napi]
pub fn normalize_type(content_type: String) -> Params {
  if content_type.contains("/") {
    return accept_params(content_type);
  }

  return Params {
    value: from_ext(&content_type).first_or_text_plain().to_string(),
    quality: None,
    params: HashMap::new(),
  };
}

// Normalize `types`, for example "html" becomes "text/html".
#[napi]
pub fn normalize_types(content_types: Vec<String>) -> Vec<Params> {
  let mut ret: Vec<Params> = Vec::new();

  for content_type in content_types {
    ret.push(normalize_type(content_type));
  }

  return ret;
}

// Compile "etag" value to function.
#[napi]
pub fn compile_e_tag() {}

// Create an ETag generator function, generating ETags with
// the given options.
fn create_e_tag_generator(weak: bool) -> impl Fn(String, Option<String>) -> String {
  return move |body: String, encoding: Option<String>| -> String {
    return etag::EntityTag::new(weak, &body).to_string();
  };
}
