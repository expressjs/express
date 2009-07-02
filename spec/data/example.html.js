
<form id="user-login">
  <fieldset>
    <legend>{ userLoginTitle }</legend>
    <input type="text" name="user[name]" value="{ user.name || 'none' }" />
    <input type="password" name="user[password]" />
    <input type="submit" name="op" value="login" />
  </fieldset>
</form>