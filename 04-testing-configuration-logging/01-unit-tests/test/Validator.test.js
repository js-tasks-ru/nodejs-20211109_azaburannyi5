const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля, которые меньше по длине', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет строковые поля, которые больше по длине', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 6');
    });

    it('валидатор проверяет граничные значения для строковых полей', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      let errors = validator.validate({ name: 'La' });

      expect(errors).to.have.length(0);

      errors = validator.validate({ name: 'Lalal' });

      expect(errors).to.have.length(0);
    });

    it('валидатор пропускает поля, для которых не указаны условия', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ test: 'Lalala' });
      
      expect(errors).to.have.length(0);
    });

    it('валидатор работает корректно даже если туда не передали ожидаемое поле', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({});

      expect(errors).to.have.length(0);
    });

    it('валидатор работает без min/max условий', () => {
      const validator = new Validator({
        name: {
          type: 'string',
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(0);
    });

    it('валидатор работает c undefined для string', () => {
      const validator = new Validator({
        name: {
          type: 'string',
        },
      });

      const errors = validator.validate({ name: undefined });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    });

    it('валидатор работает с null для string', () => {
      const validator = new Validator({
        name: {
          type: 'string',
        },
      });

      const errors = validator.validate({ name: null });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    });

    it('валидатор работает с null для number', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
        },
      });

      const errors = validator.validate({ digit: null });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
    });

    it('валидатор работает с undefined для number', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
        },
      });

      const errors = validator.validate({ digit: undefined });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
    });

    it('валидатор корректно работает с NaN для number', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
        },
      });

      const errors = validator.validate({ digit: NaN });

      expect(errors).to.have.length(0);
    });

    it('валидатор корректно работает с NaN и min/max для number', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
          min: 1,
          max: 10
        },
      });

      const errors = validator.validate({ digit: NaN });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
      expect(errors[0]).to.have.property('error').and.to.be.equal('NaN is not in range');
    });

    it('валидатор проверяет числовые поля, которые меньше по значению', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      let errors = validator.validate({ digit: 7 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 7');

      errors = validator.validate({ digit: 9.99 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 9.99');
    });

    it('валидатор проверяет числовые поля, которые больше по значению', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
          min: 2,
          max: 5,
        },
      });

      let errors = validator.validate({ digit: 9 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 5, got 9');

      errors = validator.validate({ digit: 9.01 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('digit');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 5, got 9.01');
    });

    it('валидатор проверяет граничные значения для числовых полей', () => {
      const validator = new Validator({
        digit: {
          type: 'number',
          min: 2,
          max: 5,
        },
      });

      let errors = validator.validate({ digit: 2 });

      expect(errors).to.have.length(0);

      errors = validator.validate({ digit: 2.00 });

      expect(errors).to.have.length(0);

      errors = validator.validate({ digit: 5 });

      expect(errors).to.have.length(0);

      errors = validator.validate({ digit: 5.00 });

      expect(errors).to.have.length(0);
    });

  });
});