<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
  xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  xmlns:xi="http://www.w3.org/2001/XInclude"
  xmlns:fn="http://www.w3.org/2005/xpath-functions"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema">
  
  <!-- Project-specific XSLT for transforming TEI to
       HTML. Customisations here override those in the core
       to-html.xsl (which should not be changed). -->
  
  <xsl:output method="html"/>
  <xsl:import href="../../kiln/stylesheets/tei/to-html.xsl" />
  
  <xsl:template match="tei:titleStmt/tei:title[@xml:lang!=$language]"/>
  <!--<xsl:template match="tei:seg[@xml:lang!=$language]"/>-->
  <xsl:template match="tei:div[@type='edition'][@xml:lang!=$language][not(@n)]"/>
  
  <xsl:template match="tei:sourceDesc//tei:p[1]">
    <div>
      <p><b>Original publication: </b> <xsl:apply-templates/></p>
    </div>
  </xsl:template>
  
  <xsl:template match="tei:listChange">
    <div>
      <p>
        <b>Authors: </b>
      <xsl:for-each select="tei:change">
        <xsl:sort select="position()" order="descending"/>
        <xsl:value-of select="@who"/><xsl:text> (</xsl:text>
        <xsl:value-of select="@when"/>
        <xsl:if test="normalize-space(.)!=''"><xsl:text>: </xsl:text><xsl:value-of select="."/></xsl:if>
        <xsl:text>)</xsl:text>
        <xsl:if test="position()!=last()"><xsl:text>; </xsl:text></xsl:if>
      </xsl:for-each>
      </p>
    </div>
  </xsl:template>
  
  <xsl:template match="tei:div[@n]">
    <div id="{@n}"><xsl:apply-templates/></div>
  </xsl:template>
  
  <xsl:template match="tei:lb[@n]">
    <xsl:choose>
      <xsl:when test="not(ancestor::tei:quote)"><br/></xsl:when>
      <xsl:when test="ancestor::tei:quote and (preceding-sibling::node() or normalize-space(string-join(preceding-sibling::text(), ''))!='')"><br/></xsl:when>
    </xsl:choose>
    <xsl:text>(</xsl:text><xsl:value-of select="@n"/><xsl:text>) </xsl:text>
  </xsl:template>
  
  <xsl:template match="tei:quote//tei:lb[1][not(@n)]">
    <xsl:choose>
      <xsl:when test="not(preceding-sibling::node()) or not(normalize-space(string-join(preceding-sibling::text(), ''))!='')"></xsl:when>
      <xsl:otherwise><br/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template match="tei:emph[ancestor::tei:quote]">
    <b style="margin-left:-1em"><xsl:apply-templates/></b>
  </xsl:template>
  
  <xsl:template match="tei:quote">
    <p class="quotation"><xsl:apply-templates/></p>
  </xsl:template>
  
  <xsl:template match="tei:listBibl//tei:bibl">
    <p id="{@xml:id}"><xsl:apply-templates/></p>
  </xsl:template>
  
  <xsl:template priority="10" match="tei:titleStmt/tei:title">
    <xsl:value-of select="."/>
    <xsl:apply-templates/>
  </xsl:template>
  
  <!--<xsl:template match="tei:div[@n][ancestor::tei:TEI[@xml:id]]">
    <div id="{concat(ancestor::tei:TEI/@xml:id,'-',@n)}"><xsl:apply-templates/></div>
  </xsl:template>-->
  
</xsl:stylesheet>