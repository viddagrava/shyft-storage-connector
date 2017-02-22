
'use strict';


import _ from 'lodash';
import { registry } from '../../';

const dataTypeNames = [
  'string',
  'integer',
  'bigint',
  'boolean',
  'email',
  'date',
  'time',
  'timetz',
  'timestamp',
  'timestamptz',
  'json',
  'password',
  'reference'
]



describe('data types', function() {

  _.map(dataTypeNames, function(dataTypeName) {

    const fixtures = require(`../fixtures/datatypes/${dataTypeName}`).default
    const dataType = registry.getDataType(dataTypeName)
    const definitionValidator = dataType.getDefinitionValidator()

    describe(dataTypeName, function() {

      if (fixtures.skip) {
        return it.skip('TODO')
      }

      if (!fixtures.valid || !fixtures.valid.length) {
        throw new Error('Test fixture is broken')
      }


      it('should accept valid definitions', function() {

        _.map(fixtures.valid, function(validDefinition) {

          let valid

          valid = definitionValidator( validDefinition )

          expect(valid).to.be.true

        })

      })


      describe('should reject definition when', function() {

        if (!fixtures.invalid || !fixtures.invalid.length) {
          throw new Error('Test fixture is broken')
        }

        _.map(fixtures.invalid, function(invalid) {

          if (!invalid.errors || !invalid.errors.length) {
            throw new Error('Test fixture is broken')
          }

          _.map(invalid.errors, function(error) {

            it(error.reason, function() {

              let valid
              let forwardError

              function fn() {
                valid = definitionValidator( invalid.setup )

                if (!valid) {
                  forwardError = new Error('Validation Error')
                  forwardError.validationErrors = definitionValidator.errors
                  throw forwardError
                }
              }

              expect(fn).to.throw().and.to.satisfy(function(err) {
                let matched = false

                _.map(err.validationErrors, function(validationError) {

                  if (JSON.stringify(validationError).match(error.msg)) {
                    matched = true
                  }
                })

                return matched
              });

            })

          })

        })

      })

    })

  })

})
