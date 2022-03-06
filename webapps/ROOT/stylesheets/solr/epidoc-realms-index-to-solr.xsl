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
    <xsl:variable name="key-values">
      <xsl:for-each select="//tei:rs[@key]/@key">
        <xsl:value-of select="normalize-space(.)" />
        <xsl:text> </xsl:text>
      </xsl:for-each>
    </xsl:variable>
    <xsl:variable name="keys" select="distinct-values(tokenize(normalize-space($key-values), '\s+'))" />
    <add>
      <xsl:for-each select="$keys">
        <xsl:variable name="realm" select="." />
        <xsl:variable name="thesaurus" select="document('../../content/lares_framework/resources/thesaurus.xml')/tei:TEI/tei:teiHeader/tei:encodingDesc/tei:classDecl/tei:taxonomy"/>
        <xsl:variable name="key" select="document('../../content/lares_framework/resources/thesaurus.xml')/tei:TEI/tei:teiHeader/tei:encodingDesc/tei:classDecl/tei:taxonomy//tei:category[@xml:id=$realm]"/>
        <xsl:variable name="item" select="$root//tei:rs[contains(concat(' ', @key, ' '), concat(' ', $realm, ' '))]" />
        <xsl:for-each-group select="$item" group-by="concat(., '-', $realm)">
          <xsl:variable name="specific-item" select="."/>
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
            <xsl:choose>
              <xsl:when test="$thesaurus//tei:category[@xml:id=$realm]">
                <xsl:value-of select="concat($thesaurus//tei:category[@xml:id=$realm]/@n, ': ', $thesaurus/tei:category[not(ancestor::tei:category)][descendant::tei:category[@xml:id=$realm]]/tei:gloss[@xml:lang='en'], '. ', $thesaurus//tei:category[@xml:id=$realm]/tei:gloss[@xml:lang='en'])"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="$realm" />
              </xsl:otherwise>
            </xsl:choose>
          </field>
          <field name="index_attested_form">
            <xsl:value-of select="$specific-item" />
          </field>
          <xsl:apply-templates select="current-group()" />
        </doc>
          </xsl:for-each>
        </xsl:for-each-group>
      </xsl:for-each>
      
      
      <!--<xsl:for-each-group select="//tei:rs[@key]" group-by="concat(@key,'-',@corresp,'-',.)"> <!-\- tokenize @key -\->
        <xsl:variable name="thesaurus" select="document('../../content/lares_framework/resources/thesaurus.xml')/tei:TEI/tei:teiHeader/tei:encodingDesc/tei:classDecl/tei:taxonomy"/>
        <xsl:variable name="realm" select="@key"/>
        <doc>
          <field name="document_type">
            <xsl:value-of select="$subdirectory" />
            <xsl:text>_</xsl:text>
            <xsl:value-of select="$index_type" />
            <xsl:text>_index</xsl:text>
          </field>
          <xsl:call-template name="field_file_path" />
          <field name="index_field">
            <xsl:value-of select="$thesaurus/tei:category[not(ancestor::tei:category)][descendant::tei:category[@xml:id=$realm]]/tei:gloss[@xml:lang='en']" />
          </field>
          <field name="index_item_name">
            <xsl:choose>
              <xsl:when test="$thesaurus//tei:category[@xml:id=$realm]">
                <xsl:value-of select="concat($thesaurus//tei:category[@xml:id=$realm]/@n, ': ', $thesaurus//tei:category[@xml:id=$realm]/tei:gloss[@xml:lang='en'])"/>
              </xsl:when>
              <xsl:otherwise>
                <xsl:value-of select="@key" />
              </xsl:otherwise>
            </xsl:choose>
          </field>
          <field name="index_attested_form">
            <xsl:value-of select="." />
          </field>
          <xsl:apply-templates select="current-group()" />
        </doc>
      </xsl:for-each-group>-->
    </add>
  </xsl:template>

  <xsl:template match="tei:rs">
    <xsl:call-template name="field_index_instance_location" />
  </xsl:template>

</xsl:stylesheet>