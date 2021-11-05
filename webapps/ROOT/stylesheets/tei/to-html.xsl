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
  
  <xsl:template match="tei:div[@n]">
    <div id="{@n}"><xsl:apply-templates/></div>
  </xsl:template>
  
  <xsl:template match="tei:lb[@n]">
    <br/><span style="margin-left:-1px"><xsl:text>(</xsl:text><xsl:value-of select="@n"/><xsl:text>) </xsl:text></span>
  </xsl:template>
  
  <xsl:template match="tei:emph[ancestor::tei:quote]">
    <b style="margin-left:-1em"><xsl:apply-templates/></b>
  </xsl:template>
  
  <xsl:template match="tei:quote">
    <p style="margin-left:2em; margin-top:-2em"><xsl:apply-templates/></p>
  </xsl:template>
  
  <!--<xsl:template match="tei:div[@n][ancestor::tei:TEI[@xml:id]]">
    <div id="{concat(ancestor::tei:TEI/@xml:id,'-',@n)}"><xsl:apply-templates/></div>
  </xsl:template>-->
  
</xsl:stylesheet>