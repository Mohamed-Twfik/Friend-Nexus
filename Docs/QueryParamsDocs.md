# ApiFeature Class Documentation

## Overview

The `ApiFeature` class provides a powerful way to interact with MongoDB databases by allowing clients to specify various query parameters in their requests. This documentation outlines the supported query parameters and their syntax.

## Query Parameters Syntax

Clients can use the following query parameters to customize their database queries:

- **Pagination**: Clients can paginate query results using the `page` and `pageSize` parameters.
  - Syntax: `?page=<page_number>&pageSize=<page_size>`

- **Filtering**: Clients can filter query results based on specific criteria.
  - Syntax: `?<field>=<value>&...`

- **Sorting**: Clients can sort query results based on one or more fields.
  - Syntax: `?sort=<field1>,<field2>,...`

- **Searching**: Clients can search query results for a keyword across multiple fields.
  - Syntax: `?search=<keyword>`

- **Selecting Fields**: Clients can select specific fields in the query results.
  - Syntax: `?fields=<field1>,<field2>,...`

## Usage Examples

### Pagination

To paginate query results, specify the page number and page size using the `page` and `pageSize` parameters:

```http
GET /api/users?page=1&pageSize=10
```

### Filtering

To filter query results, specify filter criteria using field-value pairs in the query parameters:

```http
GET /api/users?role=admin&status=active
```

### Sorting

To sort query results, specify field names in the `sort` parameter. Prefix with `-` for descending order:

```http
GET /api/users?sort=createdAt,-name
```

### Searching

To search query results for a keyword, use the `search` parameter:

```http
GET /api/users?search=John
```

### Selecting Fields

To select specific fields in the query results, use the `fields` parameter:

```http
GET /api/users?fields=name,email,createdAt
```

## Example

Here's an example of how a client can use the `ApiFeature` class to fetch paginated, filtered, and sorted query results:

```http
GET /api/users?page=1&pageSize=10&role=admin&sort=-createdAt&search=John&fields=name,email
```

This query fetches the first page of 10 users with the role "admin", sorted by creation date in descending order, whose names or emails contain "John", and returns only their names and email addresses.