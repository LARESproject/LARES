<?xml version="1.0" encoding="UTF-8"?>
<!-- $Id: teinote.xsl 2354 2015-05-08 16:28:41Z paregorios $ -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:t="http://www.tei-c.org/ns/1.0" exclude-result-prefixes="t" 
                version="2.0">
  <!-- Imported from [htm|txt]-teinote.xsl -->

  <xsl:template match="t:note">
      <xsl:text>(</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>)</xsl:text>
  </xsl:template>


</xsl:stylesheet>