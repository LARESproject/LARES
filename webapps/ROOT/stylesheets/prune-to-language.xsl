<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:tei="http://www.tei-c.org/ns/1.0">

  <!-- XSLT to strip out material that is not in the supplied
       language. -->

  <xsl:param name="language"/>

    <xsl:template match="*[@xml:lang!=$language and not(@xml:lang=('la', 'grc', 'he')) and not(self::tei:TEI or self::tei:teiHeader)]"/>

  <xsl:template match="tei:foreign" priority="10">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
