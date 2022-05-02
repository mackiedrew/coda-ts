# Coda TS

https://coda.io/developers/apis/v1


# Install

Add `coda-ts` to your project with either:


```
npm install coda-ts
```

```
yarn add coda-ts
```

# Usage

Create an API instance with:

```typescript
const coda = new Coda(CODA_API_KEY);
```

# Resource Structure
- Coda
  - whoAmI()
  - resolveBrowserLink()
  - Docs
    - list()
    - count() - BROKEN DUE TO REPORTED CODA BUG
    - create()
    - get()
    - categories()
    - idFromUrl()
    - Doc
      - set()
      - get()
      - refresh()
      - delete()
      - getShareMetadata()
      - publish()
      - unpublish()
      - Pages
        - Page
          - get()
          - set()
          - update()
          - refresh()
      - Automation
        - trigger()
      - Tables
        - Table
          - Columns
            - list()
            - get()
      - Controls
        - list()
        - get()
      - Formulas
        - list()
        - get()
      - Permissions
        - list()
        - add()
        - delete()
- Mutation
  - status()

# Docs
Almost every aspect of Coda wraps up into a `Doc`.

## Getting Doc ID

Aalmost every API call will also require a `docId`. Since this isn't the most common way to work with Coda in-browser you may not find it intuitive to find this value. The best way to find the `docId` is to look at the structure of any Coda link. For example, in the following link you can find the ID of the doc as everything past the `d/_d` and before the first following `/`: 

### Manually extracted

URL:
```
https://coda.io/d/_duq0jEWnseE/Automations_suPXH#_luXb5
```

ID: `uq0jEWnseE`

### Coda's official approach
Coda does provide a helper in their docs to extract a `docId` but not as an API, but rather as a form: https://coda.io/developers/apis/v1#section/Using-the-API/Resource-IDs-and-Links

### Using the helper

This package provides a helper to extract the `docId` from a URL. This is not a documented process by the Coda API but it is based the officially provided form from the official approach; it also appears to be true based on observation.

```typescript
const url = 'https://coda.io/d/_duq0jEWnseE/Automations_suPXH#_luXb5';
const docId = coda.Docs.idFromUrl(url);
// docId: uq0jEWnseE
```


# Permissions

## List permissions

You'd expect permissions to to generally follow the flow of the UI of Coda. Especially considering the on the defined `Principal` [type](src/resources/permission.ts). However, when working with the permissions listing API it won't work exactly as-is intuitive. It will not list `Anyone` permissions or (TODO: VALIDATE DOMAIN). Wen working with the permissions listing API you should expect to see only `Email` to show up in the list. I do not have a recommendation for getting the permissions list inclusive of these exceptions yet.

```typescript
const permissionList = doc.Permissions.list();
```

## Add permissions

```typescript
doc.Permissions.add({
  access: AccessType.Write;
  principal: PrincipalEmail;
  supressEmail: false;
});
```

## Delete permissions

```typescript
doc.Permissions.delete('permission id');
```
