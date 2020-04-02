var stringFieldXMLTemplate = "  <String>\n" +
    "    <Key><%= fieldKey %></Key>\n" +
    "    <% if (!_.isEmpty(fieldValue)) { %>\n" +
    "      <Value><%= fieldValue %></Value>\n" +
    "    <% } else { %>\n" +
    "      <Value/>\n" +
    "    <% } %>\n" +
    "  </String>\n"
module.exports = stringFieldXMLTemplate;