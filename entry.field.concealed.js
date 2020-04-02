 var concealedFieldXMLTemplate = "  <String>\n" +
     "    <Key><%= fieldKey %></Key>\n" +
     "    <% if (!_.isEmpty(fieldValue)) { %>\n" +
     "      <Value ProtectInMemory=\"True\"><%= fieldValue %></Value>\n" +
     "    <% } else { %>\n" +
     "      <Value ProtectInMemory=\"True\" />\n" +
     "    <% } %>\n" +
     "  </String>\n"
  module.exports = concealedFieldXMLTemplate;