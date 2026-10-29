-- CRIAÇÃO DO BANCO DE DADOS

CREATE DATABASE supermercado;

-- INICIALIZAR O BANCO DE DADOS CRIADO
USE supermercado;



-- CRIANDO AS TABELAS QUE NÃO TEM CHAVE ESTRANGEIRA
-- DROP TABLE nomeTabela;
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

CREATE TABLE IF NOT EXISTS setores (
  idsetores INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  descricao VARCHAR(200) NULL,
  status TINYINT NOT NULL
);

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
  turnos_idturnos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario (
  idusuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  cpf VARCHAR(45) NOT NULL,
  email VARCHAR(200) NOT NULL,
  senha VARCHAR(45) NOT NULL,
  bloqueio TINYINT NULL,
  Funcionario_idFuncionario INT NOT NULL
);

CREATE TABLE IF NOT EXISTS diasTrabalhados (
  iddiasTrabalhados INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS escala (
  idescala INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  periodoInicial VARCHAR(45) NOT NULL,
  periodoFinal VARCHAR(45) NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS ponto (
  idponto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  data VARCHAR(45) NOT NULL,
  horario VARCHAR(45) NOT NULL,
  justificativa VARCHAR(200) NULL,
  arquivo LONGBLOB NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS ferias (
  idferias INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  inicio VARCHAR(45) NOT NULL,
  final VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL
);

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
  Funcionario_turnos_idturnos INT NOT NULL
);

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
  Funcionario_turnos_idturnos INT NOT NULL
);

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

CREATE TABLE IF NOT EXISTS historicoAcessos (
  idhistoricoAcessos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataAcesso VARCHAR(45) NOT NULL,
  horarioAcesso VARCHAR(45) NOT NULL,
  terminal_ip VARCHAR(45) NOT NULL,
  dispositivo VARCHAR(45) NOT NULL,
  usuario_idusuario INT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
  idcategorias INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao VARCHAR(300) NULL,
  status TINYINT NOT NULL
);

CREATE TABLE IF NOT EXISTS marcas (
  idmarcas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  status TINYINT NOT NULL,
  descricao VARCHAR(300) NULL
);

CREATE TABLE IF NOT EXISTS unidadeMedidas (
  idunidadeMedidas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  codigo INT NOT NULL,
  nome VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  descricao VARCHAR(300) NULL
);

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
  unidadeMedidas_idunidadeMedidas INT NOT NULL
);

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
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS etiquetas (
  idetiquetas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL,
  imagem LONGBLOB NOT NULL
);

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
  inscricaoestadual VARCHAR(45) NOT NULL
);

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
  fornecedores_idfornecedores INT NOT NULL
);

CREATE TABLE IF NOT EXISTS formasPagamento (
  idformasPagamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS condicoesPagamento (
  idcondicoesPagamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidadeParcelas INT NOT NULL,
  intervaloDias INT NOT NULL
);

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
  senha VARCHAR(45) NULL
);

CREATE TABLE IF NOT EXISTS endereco (
  idEndereco INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bairro VARCHAR(100) NOT NULL,
  cep VARCHAR(45) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(45) NOT NULL,
  rua VARCHAR(45) NOT NULL,
  numero VARCHAR(45) NOT NULL,
  cliente_idcliente INT NOT NULL
);

CREATE TABLE IF NOT EXISTS caixas (
  idcaixas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  status TINYINT NOT NULL,
  observacao VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS aberturaCaixa (
  idaberturaCaixa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataAbertura VARCHAR(45) NOT NULL,
  horarioAbertura VARCHAR(45) NOT NULL,
  valorInicial DOUBLE NOT NULL,
  caixas_idcaixas INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS fechamentoCaixa (
  idfechamentoCaixa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dataFechamento VARCHAR(45) NOT NULL,
  horarioFechamento VARCHAR(45) NOT NULL,
  valorFinal DOUBLE NOT NULL,
  aberturaCaixa_idaberturaCaixa INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL
);

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
  Funcionario_turnos_idturnos INT NOT NULL
);

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
  aberturaCaixa_idaberturaCaixa INT NOT NULL
);

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
  promocao_idpromocao INT NOT NULL
);

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
  cupom_idcupom INT NOT NULL
);

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

CREATE TABLE IF NOT EXISTS taxasEntrega (
  idtaxasEntrega INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  regiao VARCHAR(45) NOT NULL,
  tipoTaxa VARCHAR(45) NOT NULL,
  valorTaxa DOUBLE NOT NULL,
  observacao VARCHAR(45) NULL
);

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
  Funcionario_turnos_idturnos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS pedidos (
  idpedidos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroPedido VARCHAR(45) NOT NULL,
  datapedido VARCHAR(45) NOT NULL,
  statusPedido VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NULL,
  cliente_idcliente INT NOT NULL,
  usuario_idusuario INT NOT NULL,
  entregas_identregas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS contasPagar (
  idcontasPagar INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valor DOUBLE NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataPagamento VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  fornecedores_idfornecedores INT NOT NULL
);

CREATE TABLE IF NOT EXISTS contasReceber (
  idcontasReceber INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valorReceber DOUBLE NOT NULL,
  descricao VARCHAR(200) NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataRecebimento VARCHAR(45) NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  cliente_idcliente INT NOT NULL
);

CREATE TABLE IF NOT EXISTS contasFinanceiras (
  idcontasFinanceiras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  tipo VARCHAR(45) NOT NULL,
  agencia VARCHAR(45) NOT NULL,
  numeroConta VARCHAR(45) NOT NULL,
  banco VARCHAR(45) NOT NULL,
  ativo TINYINT NOT NULL
);

CREATE TABLE IF NOT EXISTS movimentacoesFinanceiras (
  idmovimentacoesFinanceiras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(45) NOT NULL,
  valor DOUBLE NOT NULL,
  dataHora VARCHAR(45) NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  origem VARCHAR(200) NOT NULL,
  contasFinanceiras_idcontasFinanceiras INT NOT NULL
);

CREATE TABLE IF NOT EXISTS estoque (
  idestoque INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidadeAtual INT NOT NULL,
  quantidadeReservada INT NOT NULL,
  dataAtualizacao VARCHAR(45) NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS lotesProdutos (
  idlotesProdutos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroLote VARCHAR(45) NOT NULL,
  datafabricacao VARCHAR(45) NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  quantidadeLote INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL
);

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
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS perdasEstoque (
  idperdasEstoque INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  dataRegistro VARCHAR(45) NOT NULL,
  motivo VARCHAR(45) NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
  lotesProdutos_idlotesProdutos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Funcionario_has_ferias (
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
  ferias_idferias INT NOT NULL,
  PRIMARY KEY (Funcionario_idFuncionario, Funcionario_cargos_idcargos, Funcionario_setores_idsetores, Funcionario_turnos_idturnos, ferias_idferias)
);

CREATE TABLE IF NOT EXISTS Funcionario_has_diasTrabalhados (
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL,
  diasTrabalhados_iddiasTrabalhados INT NOT NULL,
  PRIMARY KEY (Funcionario_idFuncionario, Funcionario_cargos_idcargos, Funcionario_setores_idsetores, Funcionario_turnos_idturnos, diasTrabalhados_iddiasTrabalhados)
);

CREATE TABLE IF NOT EXISTS compras (
  idcompras INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  valorTotal DOUBLE NOT NULL,
  situacao VARCHAR(45) NOT NULL,
  dataCompra VARCHAR(45) NOT NULL,
  fornecedores_idfornecedores INT NOT NULL,
  Funcionario_idFuncionario INT NOT NULL,
  Funcionario_cargos_idcargos INT NOT NULL,
  Funcionario_setores_idsetores INT NOT NULL,
  Funcionario_turnos_idturnos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS itensCompra (
  iditensCompra INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  precoUnitario DOUBLE NOT NULL,
  desconto DOUBLE NOT NULL,
  compras_idcompras INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS itensVendas (
  iditensVendas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  precoUnitario DOUBLE NOT NULL,
  desconto DOUBLE NOT NULL,
  valorTotal DOUBLE NOT NULL,
  vendas_idvendas INT NOT NULL
);

CREATE TABLE IF NOT EXISTS itensPedidos (
  iditensPedidos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  quantidade INT NOT NULL,
  precoUnitario DOUBLE NOT NULL,
  desconto DOUBLE NOT NULL,
  pedidos_idpedidos INT NOT NULL,
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL
);

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
  contasFinanceiras_idcontasFinanceiras INT NOT NULL
);

CREATE TABLE IF NOT EXISTS parcelasPagar (
  idparcelasPagar INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroParcela INT NOT NULL,
  valorParcela DOUBLE NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataPagamento VARCHAR(45) NULL,
  valorPago DOUBLE NULL,
  statusParcela VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NOT NULL,
  contasPagar_idcontasPagar INT NOT NULL
);

CREATE TABLE IF NOT EXISTS parcelasReceber (
  idparcelasReceber INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numeroParcela INT NOT NULL,
  valorParcela DOUBLE NOT NULL,
  dataVencimento VARCHAR(45) NOT NULL,
  dataPagamento VARCHAR(45) NULL,
  valorRecebido DOUBLE NULL,
  statusParcela VARCHAR(45) NOT NULL,
  observacao VARCHAR(200) NOT NULL,
  contasReceber_idcontasReceber INT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario_has_permissoes (
  usuario_idusuario INT NOT NULL,
  permissoes_idpermissoes INT NOT NULL,
  PRIMARY KEY (usuario_idusuario, permissoes_idpermissoes)
);

CREATE TABLE IF NOT EXISTS produtos_has_etiquetas (
  produtos_idprodutos INT NOT NULL,
  produtos_categorias_idcategorias INT NOT NULL,
  produtos_marcas_idmarcas INT NOT NULL,
  produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
  etiquetas_idetiquetas INT NOT NULL,
  PRIMARY KEY (produtos_idprodutos, produtos_categorias_idcategorias, produtos_marcas_idmarcas, produtos_unidadeMedidas_idunidadeMedidas, etiquetas_idetiquetas)
);

CREATE TABLE IF NOT EXISTS promocao_has_produtos (
    promocao_idpromocao INT NOT NULL,
    produtos_idprodutos INT NOT NULL,
    produtos_categorias_idcategorias INT NOT NULL,
    produtos_marcas_idmarcas INT NOT NULL,
    produtos_unidadeMedidas_idunidadeMedidas INT NOT NULL,
    PRIMARY KEY (promocao_idpromocao , produtos_idprodutos , produtos_categorias_idcategorias , produtos_marcas_idmarcas , produtos_unidadeMedidas_idunidadeMedidas)
);
