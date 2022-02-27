<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0"
                xmlns:kiln="http://www.kcl.ac.uk/artshums/depts/ddh/kiln/ns/1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="response" mode="text-index">
    <table class="tablesorter" style="width:100%">
      <thead>
        <tr>
          <!-- Let us assume that all texts have a filename, ID, and title. -->
          <th>Title</th>
          <!--<th>ID</th>-->
        </tr>
      </thead>
      <tbody>
        <xsl:apply-templates mode="text-index" select="result/doc[contains(str[@name='document_id'], '_')][not(starts-with(str[@name='document_id'], 'com_'))][not(starts-with(str[@name='document_id'], 'trag_'))][not(starts-with(str[@name='document_id'], 'hom_'))][not(starts-with(str[@name='document_id'], 'cpch_'))]" >
          <!-- added [contains(str[@name='document_id'], '_')] to hide other TEI files  -->
          <xsl:sort select="translate(normalize-unicode(lower-case(arr[@name='document_title']/str[1]),'NFD'), '&#x0300;&#x0301;&#x0308;&#x0303;&#x0304;&#x0313;&#x0314;&#x0345;&#x0342;' ,'')"/>
        </xsl:apply-templates>
      </tbody>
    </table>
  </xsl:template>

  <xsl:template match="result[not(doc)]" mode="text-index">
    <p>There are no files indexed from
    webapps/ROOT/content/xml/<xsl:value-of select="$document_type" />!
    Put some there, index them from the admin page, and this page will
    become much more interesting.</p>
  </xsl:template>

  <xsl:template match="result/doc" mode="text-index">
    <tr>
      <xsl:apply-templates mode="text-index" select="str[@name='file_path']" />
      <!--<xsl:apply-templates mode="text-index" select="str[@name='document_id']" />-->
      <!--<xsl:apply-templates mode="text-index" select="arr[@name='document_title']" />-->
    </tr>
  </xsl:template>

  <xsl:template match="str[@name='file_path']" mode="text-index">
    <xsl:variable name="filename" select="substring-after(., '/')" />
    <td>
      <a href="{kiln:url-for-match($match_id, ($language, $filename), 0)}">
        <xsl:apply-templates select="ancestor::doc//arr[@name='document_title']" mode="text-index"/>
      </a>
    </td>
  </xsl:template>

  <xsl:template match="str[@name='document_id']" mode="text-index">
    <td><xsl:value-of select="replace(., ' ', '')" /></td>
  </xsl:template>
  
  <xsl:template match="arr[@name='document_title']" mode="text-index">
    <xsl:choose>
      <xsl:when test="str[2]">
        <xsl:if test="$language='it'"><xsl:value-of select="str[1]"/></xsl:if>
        <xsl:if test="$language='en'"><xsl:value-of select="str[2]"/></xsl:if>
        <xsl:if test="$language='pl'"><xsl:value-of select="str[3]"/></xsl:if>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="str[1]"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
