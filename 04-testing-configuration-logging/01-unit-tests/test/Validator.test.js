const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('валидатор проверяет одно поле', () => {
      it('некорректный тип поля', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 21,
            max: 35,
          },
        });

        const errors = validator.validate({ age: '20' });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect number, got string`);
      });

      describe('некорректная длина строкового поля', () => {
        it('меньше минимального', () => {
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

        it('больше максимального', () => {
          const validator = new Validator({
            name: {
              type: 'string',
              min: 5,
              max: 10,
            },
          });

          const errors = validator.validate({ name: 'Lalalalalalalala' });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 16');
        });
      });

      describe('некорректная величина числового поля', () => {
        it('меньше минимального', () => {
          const validator = new Validator({
            age: {
              type: 'number',
              min: 18,
              max: 27,
            },
          });

          const errors = validator.validate({ age: 17 });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 17');
        });

        it('больше максимального', () => {
          const validator = new Validator({
            age: {
              type: 'number',
              min: 21,
              max: 35,
            },
          });

          const errors = validator.validate({ age: 54 });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 35, got 54');
        });

        it('проверка NaN', () => {
          const validator = new Validator({
            age: {
              type: 'number',
              min: 21,
              max: 35,
            },
          });

          const errors = validator.validate({ age: NaN });

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got NaN');
        });
      });
    });

    describe('валидатор проверяет несколько полей', () => {
      it('оба поля некорректного типа', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 21,
            max: 35,
          },
          name: {
            type: 'string',
            min: 5,
            max: 15,
          },
        });

        const errors = validator.validate({ age: '25', name: ['lala'] });

        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect number, got string`);
        expect(errors[1]).to.have.property('field').and.to.be.equal('name');
        expect(errors[1]).to.have.property('error').and.to.be.equal(`expect string, got object`);
      });

      it('оба поля корректные', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 21,
            max: 35,
          },
          name: {
            type: 'string',
            min: 5,
            max: 15,
          },
        });

        const errors = validator.validate({ age: 25, name: 'lalalala' });

        expect(errors).to.have.length(0);
      });

      it('первое поле некорректного типа, второе поле некорректной длины', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 21,
            max: 35,
          },
          name: {
            type: 'string',
            min: 5,
            max: 15,
          },
        });

        const errors = validator.validate({ age: '25', name: 'lala' });

        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect number, got string`);
        expect(errors[1]).to.have.property('field').and.to.be.equal('name');
        expect(errors[1]).to.have.property('error').and.to.be.equal(`too short, expect 5, got 4`);
      });

      it('первое поле корректное, второе поле некорректного типа', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 21,
            max: 35,
          },
          name: {
            type: 'string',
            min: 5,
            max: 15,
          },
        });

        const errors = validator.validate({ age: 25, name: ['lalala'] });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`expect string, got object`);
      });
    });  
  });
});