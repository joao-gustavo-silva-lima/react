const APIMessages = new Map<string, string>([
  ["AUTH_TOKEN_REQUIRED", "Sua sessão expirou. Entre novamente."],
  [
    "DATABASE_ERROR",
    "Não foi possível concluir a operação. Tente novamente mais tarde.",
  ],
  [
    "INTERNAL_SERVER_ERROR",
    "Ocorreu um erro inesperado. Tente novamente mais tarde.",
  ],
  ["INVALID_AUTH_TOKEN", "Sua sessão é inválida. Entre novamente."],
  ["INVALID_CONTENT_TYPE", "O formato da solicitação é inválido."],
  ["INVALID_CREDENTIALS", "E-mail ou senha incorretos."],
  ["INVALID_EMAIL_FORMAT", "Informe um endereço de e-mail válido."],
  ["EMAIL_TOO_LONG", "O email deve ter no máximo 255 caracteres."],
  ["INVALID_ID_TYPE", "O identificador informado é inválido."],
  ["INVALID_ISO_DATE_FORMAT", "A data informada é inválida."],
  ["INVALID_NAME_TYPE", "O nome deve ser um texto."],
  ["INVALID_REQUEST_BODY", "Os dados enviados são inválidos."],
  ["MISSING_REQUIRED_FIELDS", "Preencha todos os campos obrigatórios."],
  ["NAME_REQUIRED", "Informe seu nome."],
  ["NAME_TOO_LONG", "O nome deve ter no máximo 255 caracteres."],
  [
    "PASSWORD_MISSING_LOWERCASE",
    "A senha deve conter ao menos uma letra minúscula.",
  ],
  ["PASSWORD_MISSING_NUMBER", "A senha deve conter ao menos um número."],
  [
    "PASSWORD_MISSING_SPECIAL_CHARACTER",
    "A senha deve conter ao menos um caractere especial.",
  ],
  [
    "PASSWORD_MISSING_UPPERCASE",
    "A senha deve conter ao menos uma letra maiúscula.",
  ],
  ["PASSWORD_MUST_BE_STRING", "A senha deve ser um texto."],
  ["PASSWORD_TOO_LONG", "A senha deve ter no máximo 100 caracteres."],
  ["PASSWORD_TOO_SHORT", "A senha deve ter pelo menos 8 caracteres."],
  ["ROUTE_NOT_FOUND", "A rota solicitada não foi encontrada."],
  ["USER_ALREADY_EXISTS", "Já existe uma conta com esse e-mail."],
  ["USER_NOT_FOUND", "Usuário não encontrado."],
  ["CONFIRM_PASSWORD_MUST_BE_STRING", "É necessário confirmar a senha."],
  ["PASSWORDS_DONT_MATCH", "As senhas não combinam."],
  ["USER_CREATED", "O usuário foi registrado com sucesso."],
  ["LOGIN_SUCCESS", "O login foi efetuado com sucesso."],
  ["LOGOUT_SUCCESS", "O logout foi efetuado com sucesso."],
  [
    "SERVER_CONNECTION_ERROR",
    "A comunicação com o servidor falhou. Verifique a conexão e tente novamente.",
  ],
  [
    "MISSING_SERVER_ADDRESS",
    "O endereço do servidor não foi definido. Contate o suporte.",
  ],
  [
    "RESPONSE_IS_NOT_JSON",
    "A resposta do servidor não foi reconhecida. Se o problema persistir, contate o suporte.",
  ],
  [
    "UNEXPECTED_ERROR",
    "Um erro inesperado ocorreu. Tente novamente mais tarde.",
  ],
]);

export default APIMessages;
