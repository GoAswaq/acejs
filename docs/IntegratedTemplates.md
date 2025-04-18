
# 📄 IntegratedTemplates by thinkIT – Beginner Guide

**IntegratedTemplates** is a powerful yet simple templating engine developed by **thinkIT**, based on the original PEAR project `HTML_Template_IT`. It helps separate the application logic from the HTML design, allowing developers and designers to work independently and efficiently.


## ✨ Why Use IntegratedTemplates?

IntegratedTemplates lets you:

- Keep **logic** and **presentation** separate.
- Reuse **templates** across different logic flows.
- Allow designers and developers to work in parallel.
- Easily **iterate** and **reuse blocks** of content.
- Define **variables and blocks** in HTML and replace them using PHP.

---

## 📁 How Templates Work

Templates are regular `.html` files with placeholders (`{VAR_NAME}`) and blocks defined using HTML comments. 
If in a block you do not have any matched variable, the block will not be parsed/rendered (please note that if the variable exists and it is an empty string - the block will still be rendered).

### 🔹 Define a Block and Variables

```html
<!-- BEGIN article_block -->
  <h1>{ARTICLE_TITLE}</h1>
  <h2>{ARTICLE_SUBTITLE}</h2>
  <p>By {ARTICLE_AUTHOR}</p>
  <div>{ARTICLE_TEXT}</div>
<!-- END article_block -->
```

## 🧠 PHP Usage Example of the IntegratedTemplate class

```php
$tpl = new IntegratedTemplate();
$tpl->loadTemplatefile("news_template.html", true, true);

$tpl->setCurrentBlock("article_block");
$tpl->setVariable("ARTICLE_TITLE", "The Future of Tech");
$tpl->setVariable("ARTICLE_SUBTITLE", "Innovation & AI");
$tpl->setVariable("ARTICLE_AUTHOR", "Jane Doe");
$tpl->setVariable("ARTICLE_TEXT", "Lorem ipsum...");
$tpl->parseCurrentBlock("article_block");

$tpl->show();

```

### ✅ Expected Parsed Result

```html
  <h1>The Future of Tech</h1>
  <h2>Innovation & AI</h2>
  <p>By Jane Doe</p>
  <div>Lorem ipsum...</div>
```

---

## 🔄 Nesting Blocks

Yes, blocks can be nested!

```html
<!-- BEGIN list -->
  <ul>
  <!-- BEGIN item -->
    <li>{ITEM_TEXT}</li>
  <!-- END item -->
  </ul>
<!-- END list -->
```

---

## 🛠️ Helper Function: `return_parsed_template_file`

To simplify usage, **thinkIT** provides a helper function that:

- Automatically loads a template file
- Parses blocks from inner to outer
- Applies functions and conditional logic
- Returns the final HTML content

### 🔹 Usage Example

```php
$template_file = "news_template.html";
$parsed_html = return_parsed_template_file($template_file, $TEMPLATE_DATA);
echo $parsed_html;
```

Or use inline template text:

```php
$template_text = "<p>Hello {username}</p>";
echo return_parsed_template_text($template_text, $TEMPLATE_DATA);
```

---

## 🗂️ `$TEMPLATE_DATA` Structure

This array controls everything rendered by the template engine.<br>
**Remember** that if in a block you do not have any matched variable, the block will not be parsed/rendered (please note that if the variable exists and it is an empty string - the block will still be rendered). For this, $TEMPLATE_DATA contains a predefined varaible, named **_TPL_display_anyway_**. If in a block the variable {TPL_display_anyway} is present, that block will be rendered and nothing will be shown in this variable's place.


### 🔹 Basic Format

```php
$TEMPLATE_DATA = [
  'VAR_NAME' => ['type' => 'field', 'value' => 'Ssome value', 'show' => 1|0],
  'BLOCK_NAME_option_data' => ['type' => 'options', value => ['key_name' => ['value'=> '$some_value']] 'show' => 1|0],
  
  /*
   * OR - used for options like elements where only 3 key names are needed (name, value, selected)
   */
  
  'BLOCK_NAME_option_data' => ['type' => 'options', 'value' => [['value'=>'$some_value', 'name' => 'Ssome name', 'selected' => 'selected']]],
];
```

### 🔹 Types:

| `type`     | Purpose                              |
|------------|--------------------------------------|
| `field`    | Default type for variables           |
| `options`  | Used for iterated blocks (like `<select>`) |

---

---

## 🧠 PHP Usage Example with `$TEMPLATE_DATA`

```php
include("./ini/include_all.php");

$TEMPLATE_DATA["ARTICLE_TITLE"]["value"] = "The Future of Tech";
$TEMPLATE_DATA["ARTICLE_SUBTITLE"]["value"] = "Innovation & AI";
$TEMPLATE_DATA["ARTICLE_AUTHOR"]["value"] = "Jane Doe";
$TEMPLATE_DATA["ARTICLE_TEXT"]["value"] = "Lorem ipsum...";

echo return_parsed_template_file("news_template.html", $TEMPLATE_DATA);
```

### ✅ Expected Parsed Result

```html
  <h1>The Future of Tech</h1>
  <h2>Innovation & AI</h2>
  <p>By Jane Doe</p>
  <div>Lorem ipsum...</div>
```

---

## 🧩 Client Data Example

```html
<!-- BEGIN date_clienti -->
  <table>
    <tr><th>Nume</th><td>{APP_DATA_client_last_name}</td></tr>
    <tr><th>Prenume</th><td>{APP_DATA_client_first_name}</td></tr>
    <tr><th>Adresa</th><td>{APP_DATA_client_adress}</td></tr>
  </table>
<!-- END date_clienti -->
```

```php
$TEMPLATE_DATA['APP_DATA_client_last_name']['value'] = 'Popescu';
$TEMPLATE_DATA['APP_DATA_client_first_name']['value'] = 'Ion';
$TEMPLATE_DATA['APP_DATA_client_adress']['value'] = 'Str. Libertății 10';

echo return_parsed_template_file("template_client.html", $TEMPLATE_DATA);
```

### ✅ Expected Parsed Result

```html
  <table>
    <tr><th>Nume</th><td>Popescu</td></tr>
    <tr><th>Prenume</th><td>Ion</td></tr>
    <tr><th>Adresa</th><td>Str. Libertății 10</td></tr>
  </table>
```

---

## 🧩 Correct Structure for Options Blocks

To ensure proper parsing by IntegratedTemplates, `options` blocks must be written with **nested `value` arrays**.

### 🔹 PHP Structure

```php
$TEMPLATE_DATA['select_roles_option_data']['type'] = 'options';

$TEMPLATE_DATA['select_roles_option_data']['value'][0]['value_key']['value'] = 'admin';
$TEMPLATE_DATA['select_roles_option_data']['value'][0]['name_key']['value'] = 'Admin';
$TEMPLATE_DATA['select_roles_option_data']['value'][0]['selected_key']['value'] = 'selected';

$TEMPLATE_DATA['select_roles_option_data']['value'][1]['value_key']['value'] = 'user';
$TEMPLATE_DATA['select_roles_option_data']['value'][1]['name_key']['value'] = 'User';
$TEMPLATE_DATA['select_roles_option_data']['value'][1]['selected_key']['value'] = 'selected';

/*
 *  OR simple way used only for 3 values array
 */
 
 
$TEMPLATE_DATA['select_roles_option_data']['value'][0]['value'] = 'admin';
$TEMPLATE_DATA['select_roles_option_data']['value'][0]['name'] = 'Admin';
$TEMPLATE_DATA['select_roles_option_data']['value'][0]['selected'] = 'selected';

$TEMPLATE_DATA['select_roles_option_data']['value'][1]['value'] = 'user';
$TEMPLATE_DATA['select_roles_option_data']['value'][1]['name'] = 'User';
$TEMPLATE_DATA['select_roles_option_data']['value'][1]['selected'] = 'selected';


```

### 🔹 Template Block
For the block to be parsed correctly, it must be defined in the template file as follows:

For key=>value options array:
```html
<select name="USER_ROLE">
    <!-- BEGIN select_roles_option -->
    <option value="{value_key}" {selected_key}>{name_key}</option>
    <!-- END select_roles_option -->
</select>
```

For simple 3 values options array (note the useage of block name in with the 3 variables _value, _name and _selected):
```html
<select name="USER_ROLE">
<!-- BEGIN select_roles_option -->
    <option value="{select_roles_option_value}" {select_roles_option_selected}>{select_roles_option_name}</option>
<!-- END select_roles_option -->
</select>
```

### ✅ Expected Parsed Result

```html
<select name="USER_ROLE">
  <option value="admin" selected>Admin</option>
  <option value="user">User</option>
</select>
```

> ✅ Important: The block name in the template must match the structure - wiwthout the `_data` suffix.:
> `select_roles_option_data` → `<!-- BEGIN select_roles_option -->`

---

## 🧠 Advanced Template Features

### 1. 🔧 `APPLY_FUNCTION_{FUNCTION}_ON_{VARIABLE}`

```php
$TEMPLATE_DATA['username_field']['value'] = 'john';
// Parsed: ucfirst('john') = 'John'
```

```html
<!-- BEGIN RETURN_VALUE_ucfirst_ON_username_field -->
  Hello, {RETURN_VALUE_ucfirst_ON_username_field}!
<!-- END RETURN_VALUE_ucfirst_ON_username_field -->
```

```html
  Hello, John!
```

---

### 2. ⚠️ `IF_FIELD_VOID_{VARIABLE}`

```php
$TEMPLATE_DATA['bio']['value'] = '';
```

```html
<!-- BEGIN IF_FIELD_VOID_bio -->
  <p>This user has not added a biography yet.</p>
<!-- END IF_FIELD_VOID_bio -->
```

```html
  <p>This user has not added a biography yet.</p>
```

---

### 3. ✅ `IF_FIELD_NOT_VOID_{VARIABLE}`

```php
$TEMPLATE_DATA['bio']['value'] = 'Web developer and open source enthusiast.';
```

```html
<!-- BEGIN IF_FIELD_NOT_VOID_bio -->
  <p>About: {bio}</p>
<!-- END IF_FIELD_NOT_VOID_bio -->
```

```html
  <p>About: Web developer and open source enthusiast.</p>
```

---

### 4. 🧪 `IF_FIELD_{VARIABLE}_IS_{VALUE}`

```php
$TEMPLATE_DATA['user_type']['value'] = 'admin';
```

```html
<!-- BEGIN IF_FIELD_user_type_IS_admin -->
  <p>Welcome, {user_type}! You have full access.</p>
<!-- END IF_FIELD_user_type_IS_admin -->
```

```html
  <p>Welcome, admin! You have full access.</p>
```

---

### 5. 🚫 `IF_NOT_FIELD_{VARIABLE}_IS_{VALUE}`

```php
$TEMPLATE_DATA['user_type']['value'] = 'member';
```

```html
<!-- BEGIN IF_NOT_FIELD_user_type_IS_guest -->
  <p>Thank you for logging in!</p>
<!-- END IF_NOT_FIELD_user_type_IS_guest -->
```

```html
  <p>Thank you for logging in!</p>
```

---

> **Developed by thinkIT** – always smarter!  
> Contact: `dev@thinkit.dev` | Version: 2025
