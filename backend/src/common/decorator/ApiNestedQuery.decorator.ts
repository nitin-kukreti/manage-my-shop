/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

export function ApiNestedQuery(query: Function) {
  const reflector = new Reflector();
  const constructor = query.prototype;

  // Fetch Swagger properties metadata from the constructor
  const properties =
    reflector
      .get('swagger/apiModelPropertiesArray', constructor)
      ?.map((prop: string) => prop.substr(1)) || []; // Handle undefined case

  const decorators = properties
    .map((property) => {
      // Fetch the property type using reflection
      const propertyType = Reflect.getMetadata(
        'design:type',
        constructor,
        property,
      );

      // Check if the property is a primitive type or an object
      const isPrimitive = [String, Number, Boolean].includes(propertyType);

      if (isPrimitive) {
        // Handle primitive fields as simple query parameters
        return ApiQuery({
          required: false,
          name: property,
          type: propertyType,
        });
      } else {
        // Handle object fields with deepObject style
        return [
          ApiExtraModels(propertyType), // Register the extra model for Swagger
          ApiQuery({
            required: false,
            name: property,
            style: 'deepObject', // Specify the 'deepObject' style for query parameters
            explode: true, // Allow individual properties of the object to be expanded
            type: 'object',
            schema: {
              $ref: getSchemaPath(propertyType), // Reference the nested schema
            },
          }),
        ];
      }
    })
    .flat();

  return applyDecorators(...decorators);
}
