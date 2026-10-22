-- CRIAÇÃO DO BANCO DE DADOS

CREATE DATABASE supermercado;

-- drop database supermercado;

-- INICIALIZAR O BANCO DE DADOS CRIADO
USE supermercado;

-- CRIANDO AS TABELAS QUE NÃO TEM CHAVE ESTRANGEIRA
-- DROP TABLE nomeTabela;
-- TABELA 1: cargos
CREATE TABLE IF NOT EXISTS cargos (
  idcargos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(300) NULL,
  salarioBase DOUBLE NOT NULL,
  cargaHoraria INT NOT NULL,
  adicionalPericulosidade DOUBLE NULL,
  adicionalInsalubridade DOUBLE NULL,
  statusCargo TINYINT NOT NULL,
  adicionalNoturno DOUBLE NULL
);

-- TABELA 2: setores
CREATE TABLE IF NOT EXISTS setores (
  idsetores INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(200) NULL,
  status TINYINT NOT NULL
);

-- TABELA 3: turnos
CREATE TABLE IF NOT EXISTS turnos (
  idturnos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(200) NULL,
  horaInicio VARCHAR(45) NOT NULL,
  horaSaida VARCHAR(45) NOT NULL,
  intervaloInicio VARCHAR(45) NOT NULL,
  intervaloFinal VARCHAR(45) NOT NULL,
  duracaoTurno INT NOT NULL,
  turnoNoturno TINYINT NULL,
  status TINYINT NOT NULL
);

-- TABELA 4: Funcionario
CREATE TABLE IF NOT EXISTS Funcionario (
  idFuncionario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  dataNascimento VARCHAR(45) NOT NULL,
  cpf VARCHAR(45) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  dataAdmissao VARCHAR(45) NOT NULL,
  statusFuncionario TINYINT NOT NULL,
  cargos_idcargos INT NOT NULL,
  setores_idsetores INT NOT NULL,
  turnos_idturnos INT NOT NULL,
UNIQUE KEY cpf_UNIQUE (cpf),
  CONSTRAINT fk_Funcionario_cargos_idcargos FOREIGN KEY (cargos_idcargos) REFERENCES cargos (idcargos),
  CONSTRAINT fk_Funcionario_setores_idsetores FOREIGN KEY (setores_idsetores) REFERENCES setores (idsetores),
  CONSTRAINT fk_Funcionario_turnos_idturnos FOREIGN KEY (turnos_idturnos) REFERENCES turnos (idturnos)
);

-- TABELA 5: usuario
CREATE TABLE IF NOT EXISTS usuario (
  idusuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  cpf VARCHAR(45) NOT NULL,
  email VARCHAR(200) NOT NULL,
  senha VARCHAR(45) NOT NULL,
  bloqueio TINYINT NULL,
  Funcionario_idFuncionario INT NOT NULL,
UNIQUE KEY cpf_UNIQUE (cpf),
  UNIQUE KEY email_UNIQUE (email),
  CONSTRAINT fk_usuario_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 6: diasTrabalhados
CREATE TABLE IF NOT EXISTS diasTrabalhados (
  iddiasTrabalhados INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);

-- TABELA 7: escala
CREATE TABLE IF NOT EXISTS escala (
  idescala INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  periodoInicial VARCHAR(45) NOT NULL,
  periodoFinal VARCHAR(45) NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_escala_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 8: ponto
CREATE TABLE IF NOT EXISTS ponto (
  idponto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  data VARCHAR(45) NOT NULL,
  horario VARCHAR(45) NOT NULL,
  justificativa VARCHAR(200) NULL,
  arquivo LONGBLOB NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_ponto_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 9: ferias
CREATE TABLE IF NOT EXISTS ferias (
  idferias INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  inicio VARCHAR(45) NOT NULL,
  final VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL
);

-- TABELA 10: afastamentos
CREATE TABLE IF NOT EXISTS afastamentos (
  idafastamentos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL,
  inicio VARCHAR(45) NOT NULL,
  final VARCHAR(45) NOT NULL,
  dias VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  dataRegistro VARCHAR(45) NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_afastamentos_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 11: metas
CREATE TABLE IF NOT EXISTS metas (
  idmetas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL,
  periodoInicial VARCHAR(45) NOT NULL,
  periodoFinal VARCHAR(45) NOT NULL,
  metaPrevista DOUBLE NOT NULL,
  resultadoAtual DOUBLE NULL,
  porcentagemAtingido DOUBLE NULL,
  situacao VARCHAR(45) NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_metas_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 12: permissoes
CREATE TABLE IF NOT EXISTS permissoes (
  idpermissoes INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL,
  telaProdutos TINYINT NOT NULL,
  telaEstoque TINYINT NOT NULL,
  telaCompras TINYINT NOT NULL,
  telaClientes TINYINT NOT NULL,
  telaPromocoes TINYINT NOT NULL,
  telaCaixa TINYINT NOT NULL,
  telaVendas TINYINT NOT NULL,
  telaPDV TINYINT NOT NULL,
  telaPedidos TINYINT NOT NULL,
  telaEntregas TINYINT NOT NULL,
  telaRh TINYINT NOT NULL,
  telaFinaceiro TINYINT NOT NULL,
  telaRelatorios TINYINT NOT NULL
);

-- TABELA 13: historicoAcessos
CREATE TABLE IF NOT EXISTS historicoAcessos (
  idhistoricoAcessos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataAcesso VARCHAR(45) NOT NULL,
  horarioAcesso VARCHAR(45) NOT NULL,
  terminal_ip VARCHAR(45) NOT NULL,
  dispositivo VARCHAR(45) NOT NULL,
  usuario_idusuario INT NOT NULL,
CONSTRAINT fk_historicoAcessos_usuario_idusuario FOREIGN KEY (usuario_idusuario) REFERENCES usuario (idusuario)
);

-- TABELA 14: categorias
CREATE TABLE IF NOT EXISTS categorias (
  idcategorias INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao VARCHAR(300) NULL,
  status TINYINT NOT NULL
);

-- TABELA 15: marcas
CREATE TABLE IF NOT EXISTS marcas (
  idmarcas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  status TINYINT NOT NULL,
  descricao VARCHAR(300) NULL
);

-- TABELA 16: unidadeMedidas
CREATE TABLE IF NOT EXISTS unidadeMedidas (
  idunidadeMedidas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  codigo INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  descricao VARCHAR(300) NULL
);

-- TABELA 17: produtos
CREATE TABLE IF NOT EXISTS produtos (
  idprodutos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  codigo VARCHAR(200) NOT NULL,
  descricao VARCHAR(300) NULL,
  precoCusto DOUBLE NOT NULL,
  precoVenda DOUBLE NOT NULL,
  situacao TINYINT NOT NULL,
  estoque INT NOT NULL,
  validade VARCHAR(45) NOT NULL,
  imagem LONGBLOB NULL,
  categorias_idcategorias INT NOT NULL,
  marcas_idmarcas INT NOT NULL,
  unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_produtos_categorias_idcategorias FOREIGN KEY (categorias_idcategorias) REFERENCES categorias (idcategorias),
  CONSTRAINT fk_produtos_marcas_idmarcas FOREIGN KEY (marcas_idmarcas) REFERENCES marcas (idmarcas),
  CONSTRAINT fk_produtos_unidadeMedidas_idunidadeMedidas FOREIGN KEY (unidadeMedidas_idunidadeMedidas) REFERENCES unidadeMedidas (idunidadeMedidas)
);

-- TABELA 18: codigoBarras
CREATE TABLE IF NOT EXISTS codigoBarras (
  idcodigoBarras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(200) NOT NULL,
  imagem LONGBLOB NULL,
  tipo VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  descricao VARCHAR(300) NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_codigoBarras_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);

-- TABELA 19: etiquetas
CREATE TABLE IF NOT EXISTS etiquetas (
  idetiquetas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL,
  imagem LONGBLOB NOT NULL
);

-- TABELA 20: fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  idfornecedores INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nomeResponsavel VARCHAR(200) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  email VARCHAR(200) NOT NULL,
  ramal VARCHAR(45) NULL,
  cnpj VARCHAR(45) NOT NULL,
  razaoSocial VARCHAR(200) NOT NULL,
  endereco VARCHAR(300) NOT NULL,
  tipo VARCHAR(45) NULL,
  cep VARCHAR(45) NOT NULL,
  inscricaoestadual VARCHAR(45) NOT NULL,
UNIQUE KEY cnpj_UNIQUE (cnpj)
);

-- TABELA 21: contratosFornecedores
CREATE TABLE IF NOT EXISTS contratosFornecedores (
  idcontratosFornecedores INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL,
  dataInicio VARCHAR(45) NOT NULL,
  dataFinal VARCHAR(45) NOT NULL,
  valorMensal DOUBLE NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  descricao VARCHAR(300) NULL,
  prazo INT NOT NULL,
  renovacaoAutomatica TINYINT NOT NULL,
  valorTotal DOUBLE NOT NULL,
  multa DOUBLE NOT NULL,
  clausulaRecisao VARCHAR(45) NOT NULL,
  observacao VARCHAR(45) NULL,
  arquivo LONGBLOB NOT NULL,
  fornecedores_idfornecedores INT NOT NULL,
CONSTRAINT fk_contratosFornecedores_fornecedores_idfornecedores FOREIGN KEY (fornecedores_idfornecedores) REFERENCES fornecedores (idfornecedores)
);

-- TABELA 22: formasPagamento
CREATE TABLE IF NOT EXISTS formasPagamento (
  idformasPagamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);

-- TABELA 23: condicoesPagamento
CREATE TABLE IF NOT EXISTS condicoesPagamento (
  idcondicoesPagamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidadeParcelas INT NOT NULL,
  intervaloDias INT NOT NULL
);

-- TABELA 24: cliente
CREATE TABLE IF NOT EXISTS cliente (
  idcliente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  cpf VARCHAR(45) NOT NULL,
  rg VARCHAR(45) NULL,
  dataNascimento VARCHAR(45) NULL,
  genero VARCHAR(45) NULL,
  email VARCHAR(200) NULL,
  telefone VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  senha VARCHAR(45) NULL,
UNIQUE KEY cpf_UNIQUE (cpf)
);

-- TABELA 25: endereco
CREATE TABLE IF NOT EXISTS endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bairro VARCHAR(100) NOT NULL,
  cep VARCHAR(45) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(45) NOT NULL,
  rua VARCHAR(45) NOT NULL,
  numero VARCHAR(45) NOT NULL,
  cliente_idcliente INT NOT NULL,
CONSTRAINT fk_endereco_cliente_idcliente FOREIGN KEY (cliente_idcliente) REFERENCES cliente (idcliente)
);

-- TABELA 26: caixas
CREATE TABLE IF NOT EXISTS caixas (
  idcaixas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  observacao VARCHAR(200) NOT NULL
);

-- TABELA 27: aberturaCaixa
CREATE TABLE IF NOT EXISTS aberturaCaixa (
  idaberturaCaixa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataAbertura VARCHAR(45) NOT NULL,
  horarioAbertura VARCHAR(45) NOT NULL,
  valorInicial DOUBLE NOT NULL,
  caixas_idcaixas INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_aberturaCaixa_caixas_idcaixas FOREIGN KEY (caixas_idcaixas) REFERENCES caixas (idcaixas),
  CONSTRAINT fk_aberturaCaixa_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 28: fechamentoCaixa
CREATE TABLE IF NOT EXISTS fechamentoCaixa (
  idfechamentoCaixa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataFechamento VARCHAR(45) NOT NULL,
  horarioFechamento VARCHAR(45) NOT NULL,
  valorFinal DOUBLE NOT NULL,
  aberturaCaixa_idaberturaCaixa INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_fechamentoCaixa_aberturaCaixa_idaberturaCaixa FOREIGN KEY (aberturaCaixa_idaberturaCaixa) REFERENCES aberturaCaixa (idaberturaCaixa),
  CONSTRAINT fk_fechamentoCaixa_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 29: sangria
CREATE TABLE IF NOT EXISTS sangria (
  idsangria INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataSolicitacao VARCHAR(45) NOT NULL,
  motivo VARCHAR(45) NOT NULL,
  observacao VARCHAR(45) NULL,
  valorSolicitado DOUBLE NOT NULL,
  valorRetirado DOUBLE NOT NULL,
  horaSolicitacao VARCHAR(45) NOT NULL,
  aberturaCaixa_idaberturaCaixa INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_sangria_aberturaCaixa_idaberturaCaixa FOREIGN KEY (aberturaCaixa_idaberturaCaixa) REFERENCES aberturaCaixa (idaberturaCaixa),
  CONSTRAINT fk_sangria_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 30: saldoCaixa
CREATE TABLE IF NOT EXISTS saldoCaixa (
  idsaldoCaixa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  qttNotaDuzentos INT NOT NULL,
  qttNotaCem INT NOT NULL,
  qttNotaVinte INT NOT NULL,
  qttNotaCinquenta INT NOT NULL,
  qttNotaDez INT NOT NULL,
  qttNotaCinco INT NOT NULL,
  qttNotaDois INT NOT NULL,
  qttMoedaUm INT NOT NULL,
  qttMoedaCinquenta INT NOT NULL,
  qttMoedaVinteCinco INT NOT NULL,
  qttMoedaDez INT NOT NULL,
  qttMoedaCinco INT NOT NULL,
  valorSaldo DOUBLE NULL,
  aberturaCaixa_idaberturaCaixa INT NOT NULL,
CONSTRAINT fk_saldoCaixa_aberturaCaixa_idaberturaCaixa FOREIGN KEY (aberturaCaixa_idaberturaCaixa) REFERENCES aberturaCaixa (idaberturaCaixa)
);

-- TABELA 31: promocao
CREATE TABLE IF NOT EXISTS promocao (
  idpromocao INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  dataInicio VARCHAR(45) NOT NULL,
  dataFinal VARCHAR(45) NOT NULL,
  regras VARCHAR(200) NULL,
  desconto INT NOT NULL,
  qttMinima INT NOT NULL
);

-- TABELA 32: cupom
CREATE TABLE IF NOT EXISTS cupom (
  idcupom INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  codigoCupom VARCHAR(45) NOT NULL,
  tipoDesconto VARCHAR(45) NOT NULL,
  valorDesconto DOUBLE NOT NULL,
  valorMinimoCompra DOUBLE NOT NULL,
  qttMaximaUso INT NOT NULL,
  limitePorCliente INT NOT NULL,
  tipoUso VARCHAR(45) NOT NULL,
  dataInicio VARCHAR(45) NOT NULL,
  dataFinal VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NULL,
  promocao_idpromocao INT NOT NULL,
CONSTRAINT fk_cupom_promocao_idpromocao FOREIGN KEY (promocao_idpromocao) REFERENCES promocao (idpromocao)
);

-- TABELA 33: vendas
CREATE TABLE IF NOT EXISTS vendas (
  idvendas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataVenda VARCHAR(45) NOT NULL,
  horarioVenda VARCHAR(45) NOT NULL,
  valorTotal DOUBLE NOT NULL,
  valorPago DOUBLE NOT NULL,
  troco DOUBLE NOT NULL,
  quantidadeItens INT NOT NULL,
  statusVenda VARCHAR(45) NOT NULL,
  cliente_idcliente INT NOT NULL,
  usuario_idusuario INT NOT NULL,
  caixas_idcaixas INT NOT NULL,
  cupom_idcupom INT NOT NULL,
CONSTRAINT fk_vendas_cliente_idcliente FOREIGN KEY (cliente_idcliente) REFERENCES cliente (idcliente),
  CONSTRAINT fk_vendas_usuario_idusuario FOREIGN KEY (usuario_idusuario) REFERENCES usuario (idusuario),
  CONSTRAINT fk_vendas_caixas_idcaixas FOREIGN KEY (caixas_idcaixas) REFERENCES caixas (idcaixas),
  CONSTRAINT fk_vendas_cupom_idcupom FOREIGN KEY (cupom_idcupom) REFERENCES cupom (idcupom)
);

-- TABELA 34: veiculos
CREATE TABLE IF NOT EXISTS veiculos (
  idveiculos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipoVeiculo VARCHAR(45) NOT NULL,
  marca VARCHAR(45) NOT NULL,
  modelo VARCHAR(45) NOT NULL,
  anoVeiculo INT NOT NULL,
  cor VARCHAR(45) NOT NULL,
  capacidadeCarga DOUBLE NOT NULL,
  statusVeiculo VARCHAR(45) NOT NULL,
  placa VARCHAR(45) NOT NULL,
  observacoes VARCHAR(45) NULL
);

-- TABELA 35: taxasEntrega
CREATE TABLE IF NOT EXISTS taxasEntrega (
  idtaxasEntrega INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  regiao VARCHAR(45) NOT NULL,
  tipoTaxa VARCHAR(45) NOT NULL,
  valorTaxa DOUBLE NOT NULL,
  observacao VARCHAR(45) NULL
);

-- TABELA 36: entregas
CREATE TABLE IF NOT EXISTS entregas (
  identregas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataEntrega VARCHAR(45) NOT NULL,
  horarioEntrega VARCHAR(45) NOT NULL,
  statusEntrega VARCHAR(45) NOT NULL,
  cliente_idcliente INT NOT NULL,
  veiculos_idveiculos INT NOT NULL,
  taxasEntrega_idtaxasEntrega INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_entregas_cliente_idcliente FOREIGN KEY (cliente_idcliente) REFERENCES cliente (idcliente),
  CONSTRAINT fk_entregas_veiculos_idveiculos FOREIGN KEY (veiculos_idveiculos) REFERENCES veiculos (idveiculos),
  CONSTRAINT fk_entregas_taxasEntrega_idtaxasEntrega FOREIGN KEY (taxasEntrega_idtaxasEntrega) REFERENCES taxasEntrega (idtaxasEntrega),
  CONSTRAINT fk_entregas_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 37: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  idpedidos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroPedido VARCHAR(45) NOT NULL,
  datapedido VARCHAR(45) NOT NULL,
  statusPedido VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NULL,
  cliente_idcliente INT NOT NULL,
  usuario_idusuario INT NOT NULL,
  entregas_identregas INT NOT NULL,
CONSTRAINT fk_pedidos_cliente_idcliente FOREIGN KEY (cliente_idcliente) REFERENCES cliente (idcliente),
  CONSTRAINT fk_pedidos_usuario_idusuario FOREIGN KEY (usuario_idusuario) REFERENCES usuario (idusuario),
  CONSTRAINT fk_pedidos_entregas_identregas FOREIGN KEY (entregas_identregas) REFERENCES entregas (identregas)
);

-- TABELA 38: contasPagar
CREATE TABLE IF NOT EXISTS contasPagar (
  idcontasPagar INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valor DOUBLE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataPagamento VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  fornecedores_idfornecedores INT NOT NULL,
CONSTRAINT fk_contasPagar_fornecedores_idfornecedores FOREIGN KEY (fornecedores_idfornecedores) REFERENCES fornecedores (idfornecedores)
);

-- TABELA 39: contasReceber
CREATE TABLE IF NOT EXISTS contasReceber (
  idcontasReceber INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valorReceber DOUBLE NOT NULL,
  descricao VARCHAR(200) NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataRecebimento VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  cliente_idcliente INT NOT NULL,
CONSTRAINT fk_contasReceber_cliente_idcliente FOREIGN KEY (cliente_idcliente) REFERENCES cliente (idcliente)
);

-- TABELA 40: contasFinanceiras
CREATE TABLE IF NOT EXISTS contasFinanceiras (
  idcontasFinanceiras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  agencia VARCHAR(45) NOT NULL,
  numeroConta VARCHAR(45) NOT NULL,
  banco VARCHAR(45) NOT NULL,
  ativo TINYINT NOT NULL
);

-- TABELA 41: movimentacoesFinanceiras
CREATE TABLE IF NOT EXISTS movimentacoesFinanceiras (
    idmovimentacoesFinanceiras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(45) NOT NULL,
    valor DOUBLE NOT NULL,
    dataHora VARCHAR(45) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    origem VARCHAR(200) NOT NULL,
    contasFinanceiras_idcontasFinanceiras INT NOT NULL,

    CONSTRAINT fk_mov_fin_contas
        FOREIGN KEY (contasFinanceiras_idcontasFinanceiras)
        REFERENCES contasFinanceiras (idcontasFinanceiras)
);

-- TABELA 42: estoque
CREATE TABLE IF NOT EXISTS estoque (
  idestoque INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidadeAtual INT NOT NULL,
  quantidadeReservada INT NOT NULL,
  dataAtualizacao VARCHAR(45) NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_estoque_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);

-- TABELA 43: lotesProdutos
CREATE TABLE IF NOT EXISTS lotesProdutos (
  idlotesProdutos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroLote VARCHAR(45) NOT NULL,
  datafabricacao VARCHAR(45) NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  quantidadeLote INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_lotesProdutos_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);

-- TABELA 44: movimentacaoEstoque
CREATE TABLE IF NOT EXISTS movimentacaoEstoque (
  idmovimentacaoEstoque INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipoMovimentacao VARCHAR(45) NOT NULL,
  quantidade INT NOT NULL,
  dataMovimentacao VARCHAR(45) NOT NULL,
  horaMovimentacao VARCHAR(45) NOT NULL,
  documentoReferencia LONGBLOB NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_movimentacaoEstoque_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);

-- TABELA 45: perdasEstoque
CREATE TABLE IF NOT EXISTS perdasEstoque (
  idperdasEstoque INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  dataRegistro VARCHAR(45) NOT NULL,
  motivo VARCHAR(45) NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
  lotesProdutos_idlotesProdutos INT NOT NULL,
CONSTRAINT fk_perdasEstoque_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos),
  CONSTRAINT fk_perdasEstoque_lotesProdutos_idlotesProdutos FOREIGN KEY (lotesProdutos_idlotesProdutos) REFERENCES lotesProdutos (idlotesProdutos)
);

-- TABELA 46: Funcionario_has_ferias
CREATE TABLE IF NOT EXISTS Funcionario_has_ferias (
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
  ferias_idferias INT NOT NULL,
  PRIMARY KEY (Funcionario_idFuncionario, Funcionario_cargos_idcargos, Funcionario_setores_idsetores, Funcionario_turnos_idturnos, ferias_idferias),
  CONSTRAINT fk_Funcionario_has_ferias_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario),
  CONSTRAINT fk_Funcionario_has_ferias_ferias_idferias FOREIGN KEY (ferias_idferias) REFERENCES ferias (idferias)
);

-- TABELA 47: Funcionario_has_diasTrabalhados
CREATE TABLE IF NOT EXISTS Funcionario_has_diasTrabalhados (
    Funcionario_idFuncionario INT NOT NULL,
    Funcionario_cargos_idcargos INT NOT NULL,
    Funcionario_setores_idsetores INT NOT NULL,
    Funcionario_turnos_idturnos INT NOT NULL,
    diasTrabalhados_iddiasTrabalhados INT NOT NULL,

    PRIMARY KEY (
        Funcionario_idFuncionario,
        Funcionario_cargos_idcargos,
        Funcionario_setores_idsetores,
        Funcionario_turnos_idturnos,
        diasTrabalhados_iddiasTrabalhados
    ),

    CONSTRAINT fk_func_dias_func
        FOREIGN KEY (Funcionario_idFuncionario)
        REFERENCES Funcionario (idFuncionario),

    CONSTRAINT fk_func_dias_dias
        FOREIGN KEY (diasTrabalhados_iddiasTrabalhados)
        REFERENCES diasTrabalhados (iddiasTrabalhados)
);

-- TABELA 48: compras
CREATE TABLE IF NOT EXISTS compras (
  idcompras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valorTotal DOUBLE NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  dataCompra VARCHAR(45) NOT NULL,
  fornecedores_idfornecedores INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
CONSTRAINT fk_compras_fornecedores_idfornecedores FOREIGN KEY (fornecedores_idfornecedores) REFERENCES fornecedores (idfornecedores),
  CONSTRAINT fk_compras_Funcionario_idFuncionario FOREIGN KEY (Funcionario_idFuncionario) REFERENCES Funcionario (idFuncionario)
);

-- TABELA 49: itensCompra
CREATE TABLE IF NOT EXISTS itensCompra (
  iditensCompra INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  precoUnitario DOUBLE NOT NULL,
  desconto DOUBLE NOT NULL,
  compras_idcompras INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_itensCompra_compras_idcompras FOREIGN KEY (compras_idcompras) REFERENCES compras (idcompras),
  CONSTRAINT fk_itensCompra_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);

-- TABELA 50: itensVendas
CREATE TABLE IF NOT EXISTS itensVendas (
  iditensVendas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  precoUnitario DOUBLE NOT NULL,
  desconto DOUBLE NOT NULL,
  valorTotal DOUBLE NOT NULL,
  vendas_idvendas INT NOT NULL,
CONSTRAINT fk_itensVendas_vendas_idvendas FOREIGN KEY (vendas_idvendas) REFERENCES vendas (idvendas)
);

-- TABELA 51: itensPedidos
CREATE TABLE IF NOT EXISTS itensPedidos (
  iditensPedidos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  precoUnitario DOUBLE NOT NULL,
  desconto DOUBLE NOT NULL,
  pedidos_idpedidos INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
CONSTRAINT fk_itensPedidos_pedidos_idpedidos FOREIGN KEY (pedidos_idpedidos) REFERENCES pedidos (idpedidos),
  CONSTRAINT fk_itensPedidos_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);

-- TABELA 52: pagamentoVenda
CREATE TABLE IF NOT EXISTS pagamentoVenda (
  idpagamentoVendas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valor DOUBLE NOT NULL,
  valorRecebido DOUBLE NOT NULL,
  troco DOUBLE NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  referenciaTransacao VARCHAR(45) NOT NULL,
  vendas_idvendas INT NOT NULL,
  vendas_cupom_idcupom INT NOT NULL,
  formasPagamento_idformasPagamento INT NOT NULL,
  condicoesPagamento_idcondicoesPagamento INT NOT NULL,
  contasFinanceiras_idcontasFinanceiras INT NOT NULL,
CONSTRAINT fk_pagamentoVenda_vendas_idvendas FOREIGN KEY (vendas_idvendas) REFERENCES vendas (idvendas),
  CONSTRAINT fk_pagamentoVenda_formasPagamento_idformasPagamento FOREIGN KEY (formasPagamento_idformasPagamento) REFERENCES formasPagamento (idformasPagamento),
  CONSTRAINT fk_pagamentoVenda_condicoesPagamento_idcondicoesPagamento FOREIGN KEY (condicoesPagamento_idcondicoesPagamento) REFERENCES condicoesPagamento (idcondicoesPagamento),
  CONSTRAINT fk_pagamentoVenda_contasFinanceiras_idcontasFinanceiras FOREIGN KEY (contasFinanceiras_idcontasFinanceiras) REFERENCES contasFinanceiras (idcontasFinanceiras)
);

-- TABELA 53: parcelasPagar
CREATE TABLE IF NOT EXISTS parcelasPagar (
  idparcelasPagar INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroParcela INT NOT NULL,
  valorParcela DOUBLE NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataPagamento VARCHAR(45) NULL,
  valorPago DOUBLE NULL,
  statusParcela VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NOT NULL,
  contasPagar_idcontasPagar INT NOT NULL,
CONSTRAINT fk_parcelasPagar_contasPagar_idcontasPagar FOREIGN KEY (contasPagar_idcontasPagar) REFERENCES contasPagar (idcontasPagar)
);

-- TABELA 54: parcelasReceber
CREATE TABLE IF NOT EXISTS parcelasReceber (
  idparcelasReceber INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroParcela INT NOT NULL,
  valorParcela DOUBLE NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataPagamento VARCHAR(45) NULL,
  valorRecebido DOUBLE NULL,
  statusParcela VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NOT NULL,
  contasReceber_idcontasReceber INT NOT NULL,
CONSTRAINT fk_parcelasReceber_contasReceber_idcontasReceber FOREIGN KEY (contasReceber_idcontasReceber) REFERENCES contasReceber (idcontasReceber)
);

-- TABELA 55: usuario_has_permissoes
CREATE TABLE IF NOT EXISTS usuario_has_permissoes (
  usuario_idusuario INT NOT NULL,
  permissoes_idpermissoes INT NOT NULL,
  PRIMARY KEY (usuario_idusuario, permissoes_idpermissoes),
  CONSTRAINT fk_usuario_has_permissoes_usuario_idusuario FOREIGN KEY (usuario_idusuario) REFERENCES usuario (idusuario),
  CONSTRAINT fk_usuario_has_permissoes_permissoes_idpermissoes FOREIGN KEY (permissoes_idpermissoes) REFERENCES permissoes (idpermissoes)
);

-- TABELA 56: produtos_has_etiquetas
CREATE TABLE IF NOT EXISTS produtos_has_etiquetas (
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
  etiquetas_idetiquetas INT NOT NULL,
  PRIMARY KEY (produtos_idprodutos, produtos_categorias_idcategorias, produtos_marcas_idmarcas, produtos_unidadeMedidas_idunidadeMedidas, etiquetas_idetiquetas),
  CONSTRAINT fk_produtos_has_etiquetas_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos),
  CONSTRAINT fk_produtos_has_etiquetas_etiquetas_idetiquetas FOREIGN KEY (etiquetas_idetiquetas) REFERENCES etiquetas (idetiquetas)
);

-- TABELA 57: promocao_has_produtos
CREATE TABLE IF NOT EXISTS promocao_has_produtos (
  promocao_idpromocao INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
  PRIMARY KEY (promocao_idpromocao, produtos_idprodutos, produtos_categorias_idcategorias, produtos_marcas_idmarcas, produtos_unidadeMedidas_idunidadeMedidas),
  CONSTRAINT fk_promocao_has_produtos_promocao_idpromocao FOREIGN KEY (promocao_idpromocao) REFERENCES promocao (idpromocao),
  CONSTRAINT fk_promocao_has_produtos_produtos_idprodutos FOREIGN KEY (produtos_idprodutos) REFERENCES produtos (idprodutos)
);