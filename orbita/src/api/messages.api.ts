export const MESSAGES_API = new Map([
  [
    "INVALID_CONTENT_TYPE",
    "O formato enviado não é aceito. Envie os dados como JSON.",
  ],
  [
    "INVALID_REQUEST_BODY",
    "Não foi possível interpretar os dados enviados. Confira os campos e tente novamente.",
  ],
  ["INVALID_TIMESTAMP", "A data ou horário informado não é válido."],
  ["INVALID_UUID", "O identificador informado não é válido."],
  [
    "INTERNAL_SERVER_ERROR",
    "Ocorreu um erro interno do servidor. Tente novamente mais tarde.",
  ],
  [
    "UNEXPECTED_DATABASE_ERROR",
    "Não foi possível concluir a operação no banco de dados. Tente novamente mais tarde.",
  ],
  ["ROUTE_NOT_FOUND", "O endereço solicitado não foi encontrado."],

  [
    "AUTH_TOKEN_REQUIRED",
    "Sua sessão não foi identificada. Entre novamente para continuar.",
  ],
  [
    "INVALID_AUTH_TOKEN",
    "Sua sessão expirou ou é inválida. Entre novamente para continuar.",
  ],
  ["USER_LOGOUT_SUCCESS", "Você saiu da sua conta."],
  ["USER_DELETION_SUCCESS", "Sua conta foi excluída com sucesso."],
  ["USERNAME_REQUIRED", "Informe seu nome de usuário."],
  ["USERNAME_TOO_SHORT", "O nome de usuário deve ter pelo menos 3 caracteres."],
  ["USERNAME_TOO_LONG", "O nome de usuário deve ter no máximo 30 caracteres."],
  [
    "USERNAME_INVALID_FORMAT",
    "Use apenas letras, números, ponto, hífen ou sublinhado no nome de usuário. Separadores não podem ficar no início, no fim ou repetidos.",
  ],
  ["NAME_REQUIRED", "Informe seu nome."],
  ["NAME_TOO_SHORT", "O nome deve ter pelo menos 2 caracteres."],
  ["NAME_TOO_LONG", "O nome deve ter no máximo 255 caracteres."],
  ["NAME_MUST_CONTAIN_LETTERS", "O nome deve conter pelo menos uma letra."],
  ["EMAIL_REQUIRED", "Informe seu e-mail."],
  ["EMAIL_TOO_LONG", "O e-mail deve ter no máximo 255 caracteres."],
  ["EMAIL_INVALID_FORMAT", "Informe um e-mail em formato válido."],
  ["PASSWORD_REQUIRED", "Informe sua senha."],
  ["PASSWORD_TOO_SHORT", "A senha deve ter pelo menos 12 caracteres."],
  ["PASSWORD_TOO_LONG", "A senha deve ter no máximo 72 caracteres."],
  [
    "PASSWORD_MISSING_LOWERCASE",
    "A senha deve conter pelo menos uma letra minúscula.",
  ],
  [
    "PASSWORD_MISSING_UPPERCASE",
    "A senha deve conter pelo menos uma letra maiúscula.",
  ],
  ["PASSWORD_MISSING_NUMBER", "A senha deve conter pelo menos um número."],
  [
    "PASSWORD_MISSING_SPECIAL_CHARACTER",
    "A senha deve conter pelo menos um caractere especial.",
  ],
  [
    "PASSWORD_CONTAINS_WHITESPACE",
    "A senha não pode conter espaços ou outros espaços em branco.",
  ],
  [
    "LOGIN_REQUIRES_USERNAME_OR_EMAIL",
    "Informe seu nome de usuário ou e-mail para entrar.",
  ],
  [
    "USER_LOGIN_INVALID_CREDENTIALS",
    "Nome de usuário, e-mail ou senha incorretos.",
  ],
  ["USER_NOT_FOUND", "Usuário não encontrado."],
  [
    "USER_NOT_FOUND_FOR_UPDATE",
    "Não foi possível atualizar: usuário não encontrado.",
  ],
  [
    "USER_UPDATE_NOT_ALLOWED_TOO_SOON",
    "Aguarde antes de alterar seus dados novamente.",
  ],
  [
    "USER_UPDATE_DETAILS_CONFLICT",
    "Os dados informados entram em conflito com outra conta. Verifique se o nome de usuário ou e-mail já está cadastrado.",
  ],
  [
    "USER_NOT_FOUND_FOR_DELETION",
    "Não foi possível excluir: usuário não encontrado.",
  ],
  [
    "USER_DELETION_FORBIDDEN",
    "Você não tem permissão para excluir esta conta.",
  ],

  [
    "INVALID_LINK_ID",
    "O identificador do link deve ser um número inteiro positivo.",
  ],
  ["LINK_DELETED", "Link excluído com sucesso."],
  ["TITLE_REQUIRED", "Informe um título para o link."],
  ["TITLE_TOO_LONG", "O título deve ter no máximo 255 caracteres."],
  ["REFERENCE_REQUIRED", "Informe o endereço ou referência do link."],
  [
    "REFERENCE_TOO_LONG",
    "O endereço ou referência do link deve ter no máximo 255 caracteres.",
  ],
  ["VISIBILITY_REQUIRED", "Informe a visibilidade do link."],
  ["INVALID_VISIBILITY", "A visibilidade deve ser pública ou privada."],
  [
    "LINK_CREATION_QUOTA_EXCEEDED",
    "Você atingiu o limite de 10 links que pode criar.",
  ],
  [
    "LINK_CONFLICT",
    "Não foi possível salvar o link devido a um conflito. Confira os dados e tente novamente.",
  ],
  ["LINK_NOT_FOUND", "Link não encontrado."],
  [
    "LINK_NOT_FOUND_FOR_UPDATE",
    "Não foi possível atualizar: link não encontrado.",
  ],
  [
    "LINK_NOT_FOUND_FOR_DELETION",
    "Não foi possível excluir: link não encontrado.",
  ],
]);
