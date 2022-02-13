<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet exclude-result-prefixes="#all" version="2.0"
                xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
                xmlns:tei="http://www.tei-c.org/ns/1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Transform a TEI document's teiHeader into HTML. -->
  
  

  <xsl:template match="tei:teiHeader">
    <!-- the tei:titleStmt/tei:title is already provided by tei.xml -->
    <xsl:if test="//tei:idno[@type='filename']">
      <div class="chapter_description">
        <xsl:apply-templates select="//tei:sourceDesc" />
        <xsl:apply-templates select="//tei:listChange" />
      </div>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
