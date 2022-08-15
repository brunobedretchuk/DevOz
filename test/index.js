//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app = require("../src/index.js");
const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiJson = require("chai-json-schema");
const User = require("../src/models/User");
const request = require("supertest");

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
  title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
  type: "object",
  required: ["nome", "email", "idade"],
  properties: {
    nome: {
      type: "string",
    },
    email: {
      type: "string",
    },
    idade: {
      type: "number",
      minimum: 18,
    },
  },
};

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe("Um simples conjunto de testes", function () {
  it("deveria retornar -1 quando o valor não esta presente", function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});

//testes da aplicação
describe("Testes da aplicaçao", () => {
  it("o servidor esta online", function (done) {
    chai
      .request(app)
      .get("/")
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  describe("DELETE all users", () => {
    it("should delete all users", async () => {
      const resDb = await User.deleteMany();
    });
  });

  describe("GET /users", () => {
    it("should return no users", async () => {
      const resAPI = await request(app).get("/users");
      const resDb = await User.find();
      expect(resAPI.status).to.equal(200);
      expect(resDb.length).to.equal(0);
    });
  });

  describe("POST /users", () => {
    it("deveria criar o usuario raupp", function (done) {
      chai
        .request(app)
        .post("/register_user")
        .send({ nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35 })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });
    it("add user 1", function (done) {
      chai
        .request(app)
        .post("/register_user")
        .send({ nome: "one", email: "one@devoz.com.br", idade: 30 })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });
    it("add user 2", function (done) {
      chai
        .request(app)
        .post("/register_user")
        .send({ nome: "two", email: "two@devoz.com.br", idade: 20 })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });
    it("add user 3", function (done) {
      chai
        .request(app)
        .post("/register_user")
        .send({ nome: "three", email: "three@devoz.com.br", idade: 25 })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });

    it("NOT ADD user 4", function (done) {
      chai
        .request(app)
        .post("/register_user")
        .send({ nome: "four", email: "four@devoz.com.br", idade: 16 })
        .end(function (err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });
    it("add user 5", function (done) {
      chai
        .request(app)
        .post("/register_user")
        .send({ nome: "five", email: "five@devoz.com.br", idade: 20 })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          done();
        });
    });
  });
  describe("GET /users/naoExiste", () => {
    it("o usuario naoExiste não existe no sistema", function (done) {
      chai
        .request(app)
        .get("/user/naoExiste")
        .end(function (err, res) {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("GET /users/raupID", () => {
    it("o usuario raupp existe e é valido", async function () {
      const resDb = await User.find({ nome: "raupp" });
      const { id } = resDb[0];
      const rauppUser = JSON.stringify({
        nome: "raupp",
        email: "jose.raupp@devoz.com.br",
        idade: 35,
      });
      const resAPI = await request(app).get(`/users/${id}`);
      expect(resAPI.status).to.equal(200);
      expect(JSON.stringify(resDb[0])).to.include(rauppUser.slice(1, -1));
    });
  });

  describe("DELETE /users/raupID", () => {
    it("deveria excluir o usuario raupp", async function () {
      const resDb = await User.find({ nome: "raupp" });
      const { id } = resDb[0];
      const resAPI = await request(app).delete(`/users/${id}`);
      expect(resAPI.status).to.equal(302); //redirect http code
    });
  });
  describe("GET /users/raupID", () => {
    it("o usuario raupp não deve existir mais no sistema", async function () {
      const resDb = await User.find({ nome: "raupp" });
      const id = "null";
      if (resDb.length != 0) {
        id = resDb[0].id;
      }

      const resAPI = await request(app).get(`/users/${id}`);
      expect(resAPI.status).to.equal(404);
    });
  });
  describe("GET /users com pelo menos 4 users", () => {
    it("should return 4 users", async () => {
      const resAPI = await request(app).get("/users");
      const resDb = await User.find();
      const listHaveAtLeastFour = Boolean(resDb.length >= 4);
      expect(resAPI.status).to.equal(200);
      expect(listHaveAtLeastFour).to.be.true;
    });
  });
});
