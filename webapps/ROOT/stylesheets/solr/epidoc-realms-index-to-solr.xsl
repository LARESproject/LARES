<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet exclude-result-prefixes="#all"
                version="2.0"
                xmlns:tei="http://www.tei-c.org/ns/1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- This XSLT transforms a set of EpiDoc documents into a Solr
       index document representing an index of realms in those
       documents. -->

  <xsl:import href="epidoc-index-utils.xsl" />

  <xsl:param name="index_type" />
  <xsl:param name="subdirectory" />

  <xsl:template match="/">
    <xsl:variable name="root" select="." />
    <xsl:variable name="type-values">
        <xsl:for-each select="//tei:rs[@type]/@type">
        <xsl:value-of select="normalize-space(.)" />
        <xsl:text> </xsl:text>
      </xsl:for-each>
    </xsl:variable>
    <xsl:variable name="types" select="distinct-values(tokenize(normalize-space($type-values), '[\s;]+'))" />
    <add>
      <xsl:for-each select="$types">
        <xsl:variable name="realm" select="." /> 
        <xsl:variable name="item" select="$root//tei:rs[contains(concat(';', @type, ';'), concat(';', $realm, ';'))]" />
        <xsl:for-each-group select="$item" group-by="concat(., '-', $realm, '-', @subtype)">
          <xsl:variable name="specific-item" select="."/>
          <xsl:variable name="subtype" select="@subtype"/>
            <xsl:for-each select="$realm">
          <doc>
            <field name="document_type">
              <xsl:value-of select="$subdirectory" />
              <xsl:text>_</xsl:text>
              <xsl:value-of select="$index_type" />
              <xsl:text>_index</xsl:text>
            </field>
            <xsl:call-template name="field_file_path" />
            <field name="index_item_name">
              <xsl:value-of select="replace($realm, '_', ' ')" />
            </field>
              <xsl:for-each select="tokenize(normalize-space($subtype), '[\s;]+')">
                  <field name="index_item_type">
                      <xsl:value-of select="replace(., '_', ' ')" />
                  </field>
              </xsl:for-each>
              <xsl:if test="not($subtype)">
                  <field name="index_item_type">
                      <xsl:value-of select="''" />
                  </field>
              </xsl:if>
            <field name="index_attested_form">
              <xsl:value-of select="$specific-item" />
            </field>
            <xsl:apply-templates select="current-group()" />
          </doc>
            </xsl:for-each>
        </xsl:for-each-group>
      </xsl:for-each>
    </add>
  </xsl:template>

  <xsl:template match="tei:rs">
    <xsl:call-template name="field_index_instance_location" />
  </xsl:template>

</xsl:stylesheet>