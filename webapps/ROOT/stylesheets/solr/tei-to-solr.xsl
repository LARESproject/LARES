<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet exclude-result-prefixes="#all" version="2.0"
                xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
                xmlns:tei="http://www.tei-c.org/ns/1.0"
                xmlns:xd="http://www.oxygenxml.com/ns/doc/xsl"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:import href="../../kiln/stylesheets/solr/tei-to-solr.xsl" />

  <xd:doc scope="stylesheet">
    <xd:desc>
      <xd:p><xd:b>Created on:</xd:b> Oct 18, 2010</xd:p>
      <xd:p><xd:b>Author:</xd:b> jvieira</xd:p>
      <xd:p>This stylesheet converts a TEI document into a Solr index document. It expects the parameter file-path,
      which is the path of the file being indexed.</xd:p>
    </xd:desc>
  </xd:doc>

  <xsl:template match="/">
    <add>
      <xsl:apply-imports />
    </add>
  </xsl:template>
  
  <xsl:template match="tei:idno[@type='filename']" mode="facet_entry_type">
    <field name="entry_type">
      <xsl:variable name="entrytype" select="substring-before(., '_')"/>
      <xsl:choose>
        <xsl:when test="$entrytype='lexicon'"><xsl:text>Lexicon entry</xsl:text></xsl:when>
        <xsl:when test="$entrytype='text'"><xsl:text>Text</xsl:text></xsl:when>
        <xsl:when test="$entrytype='com' or $entrytype='trag' or $entrytype='hom' or $entrytype='plato' or $entrytype='hipp'"><xsl:text>Book chapter</xsl:text></xsl:when>
        <xsl:otherwise><xsl:value-of select="$entrytype"/></xsl:otherwise>
      </xsl:choose>
    </field>
  </xsl:template>
  
  <xsl:template match="tei:persName[@type='divine']|tei:persName[@type='myth']" mode="facet_literary_and_mythological_characters">
    <field name="literary_and_mythological_characters">
      <xsl:choose>
        <xsl:when test="@ref"><xsl:value-of select="@ref"/></xsl:when>
        <xsl:when test="@key"><xsl:value-of select="@key"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="."/></xsl:otherwise>
      </xsl:choose>
    </field>
  </xsl:template>
  
  <xsl:template match="tei:persName/tei:name[@nymRef]" mode="facet_person_name">
    <field name="person_name">
      <xsl:value-of select="@nymRef"/>
    </field>
  </xsl:template>
  
  <xsl:template match="tei:TEI" mode="facet_complete_edition">
    <field name="complete_edition"> 
      <xsl:apply-templates select="." />
    </field>
  </xsl:template>
  
  <xsl:template match="tei:rs[@key]" mode="facet_field">
    <xsl:for-each select="tokenize(@key, ' ')">
      <xsl:variable name="realm" select="."/>
      <xsl:variable name="thesaurus" select="document('../../content/lares_framework/resources/thesaurus.xml')/tei:TEI/tei:teiHeader/tei:encodingDesc/tei:classDecl/tei:taxonomy/tei:category[not(ancestor::tei:category)][descendant::tei:category[@xml:id=$realm]]/tei:gloss[@xml:lang='en']"/>
      <field name="field">
        <xsl:value-of select="$thesaurus"/>
      </field>
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="tei:rs[@key]" mode="facet_realm">
    <xsl:for-each select="tokenize(@key, ' ')">
    <xsl:variable name="realm" select="."/>
    <xsl:variable name="thesaurus" select="document('../../content/lares_framework/resources/thesaurus.xml')/tei:TEI/tei:teiHeader/tei:encodingDesc/tei:classDecl/tei:taxonomy"/>
    <field name="realm">
      <xsl:choose>
        <xsl:when test="$thesaurus//tei:category[@xml:id=$realm]">
          <xsl:value-of select="concat($thesaurus//tei:category[@xml:id=$realm]/@n, ': ', $thesaurus//tei:category[@xml:id=$realm]/tei:gloss[@xml:lang='en'])"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$realm" />
        </xsl:otherwise>
      </xsl:choose>
    </field>
    </xsl:for-each>
  </xsl:template>
  
  <!-- This template is called by the Kiln tei-to-solr.xsl as part of
       the main doc for the indexed file. Put any code to generate
       additional Solr field data (such as new facets) here. -->
  
  <xsl:template name="extra_fields">
    <xsl:call-template name="field_entry_type"/>
    <xsl:call-template name="field_literary_and_mythological_characters"/>
    <xsl:call-template name="field_person_name"/>
    <xsl:call-template name="field_complete_edition"/>
    <xsl:call-template name="field_field"/>
    <xsl:call-template name="field_realm"/>
  </xsl:template>
  
  <xsl:template name="field_entry_type">
    <xsl:apply-templates mode="facet_entry_type" select="/tei:TEI/tei:teiHeader/tei:fileDesc/tei:publicationStmt/tei:idno[@type='filename']"/>
  </xsl:template>
  
  <xsl:template name="field_literary_and_mythological_characters">
     <xsl:apply-templates mode="facet_literary_and_mythological_characters" select="//tei:text/tei:body/tei:div[@type='edition']" />
  </xsl:template>
  
  <xsl:template name="field_person_name">
    <xsl:apply-templates mode="facet_person_name" select="//tei:text/tei:body/tei:div[@type='edition']" />
  </xsl:template>
  
  <xsl:template name="field_complete_edition">
    <xsl:apply-templates mode="facet_complete_edition" select="/tei:TEI" />
  </xsl:template>
  
  <xsl:template name="field_field">
    <xsl:apply-templates mode="facet_field" select="//tei:text/tei:body/tei:div[@type='edition']" />
  </xsl:template>
  
  <xsl:template name="field_realm">
    <xsl:apply-templates mode="facet_realm" select="//tei:text/tei:body/tei:div[@type='edition']" />
  </xsl:template>

</xsl:stylesheet>
